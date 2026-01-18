<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  $: workspaceId = $page.params.workspaceId;

  let dragActive = false;
  let uploading = false;
  let uploadProgress = 0;
  let uploadedFiles: any[] = [];
  let error: string | null = null;

  const supportedFormats = [
    { ext: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { ext: 'HTML', mime: 'text/html' },
    { ext: 'MD', mime: 'text/markdown' },
    { ext: 'TXT', mime: 'text/plain' }
  ];

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragActive = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragActive = false;

    const files = Array.from(e.dataTransfer?.files || []);
    await uploadFiles(files);
  }

  async function handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    await uploadFiles(files);
  }

  async function uploadFiles(files: File[]) {
    error = null;
    uploading = true;
    uploadProgress = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        const isSupported = supportedFormats.some(format =>
          file.type === format.mime || file.name.toLowerCase().endsWith(`.${format.ext.toLowerCase()}`)
        );

        if (!isSupported) {
          error = `${file.name} is not a supported format`;
          continue;
        }

        // Convert file to base64
        const fileContent = await fileToBase64(file);

        // Determine file type from extension
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const fileType = ext === 'docx' ? 'docx' : ext === 'html' ? 'html' : ext === 'md' ? 'md' : 'txt';

        // Upload via tRPC
        const result = await trpc.import.document.mutate({
          workspaceId,
          fileName: file.name,
          fileContent,
          fileType: fileType as 'docx' | 'html' | 'md' | 'txt'
        });

        uploadedFiles = [...uploadedFiles, {
          id: result.noteId,
          name: file.name,
          size: file.size,
          uploadedAt: new Date()
        }];

        uploadProgress = ((i + 1) / files.length) * 100;
      }
    } catch (err) {
      error = 'Failed to upload files. Please try again.';
      console.error(err);
    } finally {
      uploading = false;
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
</script>

<div class="import-page h-full overflow-y-auto bg-canvas">
  <div class="max-w-4xl mx-auto p-8 space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-ink">Import Documents</h1>
      <p class="text-ink-muted">
        Upload documents to extract knowledge and create AI memories
      </p>
    </div>

    <!-- Upload area -->
    <div
      class="upload-area border-2 border-dashed rounded-xl p-12 transition-colors"
      class:border-accent={dragActive}
      class:bg-accent-faint={dragActive}
      class:border-border={!dragActive}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      on:drop={handleDrop}
    >
      <div class="text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
          <svg class="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <div>
          <p class="text-lg font-medium text-ink mb-2">
            Drop files here or click to browse
          </p>
          <p class="text-sm text-ink-muted">
            Supports DOCX, HTML, MD, and TXT files
          </p>
        </div>

        <input
          type="file"
          id="file-input"
          class="hidden"
          multiple
          accept=".docx,.html,.md,.txt"
          on:change={handleFileInput}
        />
        <label
          for="file-input"
          class="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-bright transition-colors cursor-pointer"
        >
          Select Files
        </label>
      </div>
    </div>

    <!-- Upload progress -->
    {#if uploading}
      <div class="bg-canvas-raised border border-border rounded-lg p-6 space-y-3">
        <div class="flex items-center justify-between">
          <span class="font-medium text-ink">Uploading...</span>
          <span class="text-ink-muted">{Math.round(uploadProgress)}%</span>
        </div>
        <div class="h-2 bg-canvas rounded-full overflow-hidden">
          <div
            class="h-full bg-accent transition-all duration-300"
            style="width: {uploadProgress}%"
          ></div>
        </div>
      </div>
    {/if}

    <!-- Error message -->
    {#if error}
      <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="font-medium text-red-500">Upload failed</p>
          <p class="text-sm text-red-400 mt-1">{error}</p>
        </div>
      </div>
    {/if}

    <!-- Uploaded files -->
    {#if uploadedFiles.length > 0}
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-ink">Uploaded Files</h2>
        <div class="space-y-2">
          {#each uploadedFiles as file}
            <div class="bg-canvas-raised border border-border rounded-lg p-4 flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-ink truncate">{file.name}</h3>
                <p class="text-sm text-ink-muted">
                  {formatFileSize(file.size)} • Uploaded just now
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Supported formats -->
    <div class="bg-canvas-raised border border-border rounded-lg p-6">
      <h3 class="font-semibold text-ink mb-4">Supported Formats</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each supportedFormats as format}
          <div class="text-center p-3 bg-canvas rounded-lg">
            <div class="text-2xl mb-2">📄</div>
            <div class="font-medium text-ink text-sm">.{format.ext}</div>
          </div>
        {/each}
      </div>
      <p class="mt-4 text-sm text-ink-muted">
        Documents are processed to extract text and create AI memories that can be referenced in conversations.
      </p>
    </div>
  </div>
</div>
