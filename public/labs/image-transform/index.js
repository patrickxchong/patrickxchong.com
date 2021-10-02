document.addEventListener('alpine:init', () => {
  Alpine.data('AlpineForm', (initialState = {}) => ({
    init() {
      // console.log("AlpineForm.init");
      // this.$watch('state.file', async (newVal) => {});
    },
    state: {
      img: null,
      file: null,
      rotate: 0,
      scaleY: 1,
      scaleX: 1,
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
    transform(opts) {
      if (!this.state.img) return;

      let transform = "";
      if (opts.rotate) {
        this.state.rotate += opts.rotate;
      }
      if (opts.scaleX) {
        this.state.scaleX *= -1;
      }
      if (opts.scaleY) {
        this.state.scaleY *= -1;
      }
      transform += `rotate(${this.state.rotate}deg) `;
      transform += `scaleX(${this.state.scaleX}) `;
      transform += `scaleY(${this.state.scaleY}) `;
      this.$refs["img-output"].style.transform = transform;
    }
  }));
});

const dispatch = (event, data) => {
  window.dispatchEvent(new CustomEvent(event, { detail: data }));
};