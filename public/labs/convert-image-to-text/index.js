document.addEventListener('alpine:init', () => {
  Alpine.data('AlpineForm', (initialState = {}) => ({
    init() {
      // console.log("AlpineForm.init");
      // this.$watch('state.file', async (newVal) => {});
    },
    state: {
      img: null,
      file: null
    },
    uploadHandler(e) {
      this.state.file = e.target.files[0];
      this.showPreviewImg(this.state.file);
    },
    dropHandler(e) {
      this.state.file = e.dataTransfer.files[0];
      this.showPreviewImg(this.state.file);
    },
    pasteHandler(e) {
      this.state.file = e.clipboardData.files[0];
      this.showPreviewImg(this.state.file);
    },
    showPreviewImg(file) {
      this.state.img = URL.createObjectURL(file);
      document.getElementById('img-input').onload = () => {
        URL.revokeObjectURL(this.state.img.src); // free memory
      };
    },
    async submitData() {
      if (!this.state.file) {
        alert("No image uploaded yet!");
        return;
      }
      this.$dispatch('notify', { message: "Reading text from image..." });
      const text = await runOCR(this.state.file);
      this.$dispatch('notify', { message: null });
      this.$dispatch('complete', { data: text });
    }
  }));
});

const dispatch = (event, data) => {
  window.dispatchEvent(new CustomEvent(event, { detail: data }));
};


(function loadTesseractCore() {
  let t = document.createElement("script");
  t.type = "text/javascript";
  t.async = !0;
  t.defer = !0;
  // Check for WASM support
  t.src = typeof WebAssembly === 'object' ? 'https://unpkg.com/tesseract.js-core/tesseract-core.wasm.js' : 'https://unpkg.com/tesseract.js-core/tesseract-core.asm.js';
  let n = document.getElementsByTagName("script")[0];
  n
    .parentNode
    .insertBefore(t, n);
})();

const runOCR = async (file) => {
  const { data: { text } } = await Tesseract.recognize(file, 'eng', {
    logger: m => {
      // console.log(m);
      if (m.status === "recognizing text") {
        dispatch("notify", { message: "Reading text from image...", percentage: Math.round(m.progress * 100) });
      }
    },
  });
  return text;
};

const copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

const downloadText = (text, fileName) => {
  let urlFile = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  let a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  a.href = urlFile;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(a.href);
  a.remove();
};