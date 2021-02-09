'use strict';

import {language} from "./language";
import {bytesToSize, noop, element} from "./utills";


export function upload(selector, options = {}) {

    let files = [];

    const currentLanguage = language.EN;
    const onUpload = options.onUpload ?? noop();
    const input = document.querySelector(selector);
    const preview = element('div', ['uploader__preview']);
    const open = element('button', ['btn'], currentLanguage.OPEN);
    const upload = element('button', ['btn', 'primary'], currentLanguage.UPLOAD);

    upload.style.display = 'none';

    if (options.multi) {
        input.setAttribute('multiple', true);
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);

    const triggerInput = () => input.click();

    const changeHandler = event => {
        if (!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);

        preview.innerHTML = '';

        upload.style.display = 'inline';

        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader();

            reader.onload = ev => {
                const src = ev.target.result;

                preview.insertAdjacentHTML('afterbegin', `
                <div class="uploader__preview-image">
                    <button class="uploader__preview-remove" aria-label="${currentLanguage.DELETE_THIS_IMG}" data-name="${file.name}">&times;</button>
                    <img src="${src}" alt="${file.name}"> 
                    <div class="uploader__preview-info">
                        <span>${file.name}</span>
                        ${bytesToSize(file.size)}
                    </div>
                </div>
                `)
            };

            reader.readAsDataURL(file);

        })
    };

    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return
        }
        const {name} = event.target.dataset;
        files = files.filter(file => file.name !== name);


        if (!files.length) {
            upload.style.display = 'none';
        }

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.uploader__preview-image');
        block.classList.add('uploader__removing');
        setTimeout(() => block.remove(), 300);
    };

    const clearPreview = el => {
        el.style.bottom = '0';
        el.innerHTML = '<div class="uploader__preview-info-progress"></div>';

    };

    const uploadHandler = () => {
        preview.querySelectorAll('.uploader__preview-remove').forEach(e => e.remove());
        const previewInfo = preview.querySelectorAll('.uploader__preview-info');
        previewInfo.forEach(clearPreview);
        onUpload(files, previewInfo);
    };

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler);
}