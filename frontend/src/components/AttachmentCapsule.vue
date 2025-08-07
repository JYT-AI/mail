<template>
	<div
		class="group flex items-center space-x-2 rounded-full border px-2 py-1.5"
		:class="{ 'hover:border-outline-gray-3 cursor-pointer': blobID }"
	>
		<button
			class="flex min-w-0 flex-1 items-center space-x-2"
			@click="openAttachment"
		>
			<Loader
				v-if="isLoading"
				class="text-ink-gray-4 h-3.5 min-h-3.5 w-3.5 min-w-3.5 animate-spin"
			/>
			<Paperclip v-else class="text-ink-gray-4 h-3.5 min-h-3.5 w-3.5 min-w-3.5" />
			<span class="truncate text-sm">{{ fileName }}</span>
		</button>
		<button
			v-if="blobID"
			class="text-ink-gray-4 hover:text-ink-gray-6 rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
			:class="{ 'pointer-events-none opacity-30': isDownloading }"
			@click.stop="downloadAttachment"
			:title="__('Download')"
			:disabled="isDownloading"
		>
			<Loader v-if="isDownloading" class="h-3.5 w-3.5 animate-spin" />
			<Download v-else class="h-3.5 w-3.5" />
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, Loader, Paperclip } from 'lucide-vue-next'
import { createResource } from 'frappe-ui'

const { fileName, blobID, type } = defineProps<{
	fileName: string
	blobID?: string
	type?: string
}>()

const isLoading = ref(false)
const isDownloading = ref(false)

const openAttachment = async () => {
	if (!blobID) return
	isLoading.value = true
	await fetchAttachment.submit()
	isLoading.value = false
}

const downloadAttachment = async () => {
	if (!blobID) return
	isDownloading.value = true
	await fetchAttachmentForDownload.submit()
	isDownloading.value = false
}

const fetchAttachment = createResource({
	url: 'mail.api.mail.fetch_attachment',
	makeParams: () => ({ blob_id: blobID }),
	cache: ['attachment', blobID],
	onSuccess: (data: number[]) => {
		const byteArray = new Uint8Array(data)
		const blob = new Blob([byteArray], { type })
		const url = URL.createObjectURL(blob)
		window.open(url, '_blank')
	},
	onError: () => (isLoading.value = false),
})

const fetchAttachmentForDownload = createResource({
	url: 'mail.api.mail.fetch_attachment',
	makeParams: () => ({ blob_id: blobID }),
	cache: ['attachment-download', blobID],
	onSuccess: (data: number[]) => {
		const byteArray = new Uint8Array(data)
		const blob = new Blob([byteArray], { type })
		const url = URL.createObjectURL(blob)

		// Create a temporary link element for download
		const link = document.createElement('a')
		link.href = url
		link.download = fileName || 'attachment'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		// Clean up the object URL
		URL.revokeObjectURL(url)
	},
	onError: () => (isDownloading.value = false),
})
</script>
