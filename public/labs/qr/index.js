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
      const text = await runOCR(this.state.img);
      this.$dispatch('notify', { message: null });
      this.$dispatch('complete', { data: text });
    }
  }));
});

const dispatch = (event, data) => {
  window.dispatchEvent(new CustomEvent(event, { detail: data }));
};


/** @param {string} source */
async function imageDataFromSource(source) {
  const image = Object.assign(new Image(), { src: source });
  await new Promise(resolve => image.addEventListener('load', () => resolve()));
  const context = Object.assign(document.createElement('canvas'), {
    width: image.width,
    height: image.height
  }).getContext('2d');
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
}

const runOCR = async (file) => {
  const imageData = await imageDataFromSource(file);
  console.log(imageData);
  decoded = jsQR(imageData.data, imageData.width, imageData.height);
  console.log(decoded);
  return decoded.data;
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