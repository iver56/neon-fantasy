(() => {
      const fonts = {};
      for(const name in fonts) {
        const id = name + '-font';
        const font = fonts[name];
        const s = document.createElement('style');
        s.setAttribute('id', id);
        s.innerHTML = [
          '@font-face {',
          'font-family: "' + name + '";',
          'src: url(data:application/x-font-woff2;charset=utf-8;base64,' + font + ') format("woff2");',
          '}'
        ].join('\n');
        document.body.appendChild(s);
      }
    })();