// {{ something | debug | safe }}
module.exports = (content) => `<script>
let data = ${inspect(content)};
console.log(data);</script>`;