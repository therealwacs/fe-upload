function bytesToSize(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (!bytes) {
	   return '0 Byte'
   }
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const element = (tag, classes, content) => {
	const node = document.createElement(tag)
	if (classes.length) {
		node.classList.add(...classes)
	}
	if (content) {
		node.textContent = content
	}
	return node
}

function noop() {}

export function upload(selector, options = {}) {
	let files = []

	const onUpload = options.onUpload ?? noop

	const input = document.querySelector(selector)
	input.style.display = 'none'

	const preview = element('div', ['preview'])
	const open = element('button', ['btn'], 'Открыть')
	const upload = element('button', ['btn', 'primary'], 'Загрузить')
	upload.style.display = 'none'

	// Set input attributes
	if (options.multiple) {
		input.setAttribute('multiple', true)
	}
	if (options.accept && Array.isArray(options.accept)) {
		input.setAttribute('accept', options.accept.join(','))
	}

	// Insert elements into DOM three
	input.insertAdjacentElement('afterend', preview)
	input.insertAdjacentElement('afterend', upload)
	input.insertAdjacentElement('afterend', open)

	// Input trigger
	const triggerInput = () => input.click()

	// Change handler
	const changeHandler = event => {
		if (!event.target.files.length) {
			return
		}

		files = Array.from(event.target.files)
		preview.innerHTML = ''
		upload.style.display = 'inline'
		files.forEach(file => {
			if (!file.type.match('image')) {
				return
			}

			console.log(file)
			const reader = new FileReader()

			reader.readAsDataURL(file)
			reader.onload = ev => {
				const src = ev.target.result
				preview.insertAdjacentHTML('afterbegin', `
					<div class="preview-image">
						<div class="preview-remove" data-name="${file.name}" title="Удалить изображение">&times;</div>
						<img src="${src}" alt="${file.name}" title="${file.name}">
						<div class="preview-info">
							<div class="file-name">${file.name}</div>
							<div class="file-size">${bytesToSize(file.size)}</div>
						</div>
					</div>
				`)
			}
		})

	}

	// Remove handler
	const removeHandler = event => {
		if (!event.target.dataset.name) {
			return
		}

		const {name} = event.target.dataset
		files = files.filter(file => file.name !== name )

		if (!files.length) {
			upload.style.display = 'none'
		}

		const block = preview.querySelector(`.preview-remove[data-name="${name}"]`).closest('.preview-image')
		block.classList.add('removing')
		setTimeout(() => block.remove(), 300)

	}

	const clearPreview = el => {
		el.style.height = '10px'
		el.style.transform = 'translateY(0)'
		el.innerHTML  = `<div class="preview-info-progress"></div>`
	}

	// Upload handler
	const uploadHandler = () => {
		preview.querySelectorAll('.preview-remove').forEach(el => el.remove())
		const previewInfo = preview.querySelectorAll('.preview-info')
		previewInfo.forEach(clearPreview)
		onUpload(files, previewInfo)
	}

	// Add event listeners
	open.addEventListener('click', triggerInput)
	input.addEventListener('change', changeHandler)
	preview.addEventListener('click', removeHandler)
	upload.addEventListener('click', uploadHandler)
}