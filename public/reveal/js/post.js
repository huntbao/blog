// Full list of configuration options available at:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
	controls: true,
	progress: true,
	history: true,
	center: true,
	transition: 'slide', // none/fade/slide/convex/concave/zoom
	// Optional reveal.js plugins
	dependencies: [
		{
			src: '/public/reveal/lib/js/classList.js',
			condition: function () {
				return !document.body.classList;
			}
		},
		{
			src: '/public/reveal/plugin/markdown/marked.js',
			condition: function () {
				return !!document.querySelector('[data-markdown]');
			}
		},
		{
			src: '/public/reveal/plugin/markdown/markdown.js',
			condition: function () {
				return !!document.querySelector('[data-markdown]');
			}
		},
		{
			src: '/public/reveal/plugin/highlight/highlight.js',
			async: true,
			callback: function () {
				hljs.initHighlightingOnLoad();
			}
		},
		{src: '/public/reveal/plugin/zoom-js/zoom.js', async: true},
		{src: '/public/reveal/plugin/notes/notes.js', async: true}
	]
});
