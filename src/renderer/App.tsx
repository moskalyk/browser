import React, { useEffect, useState } from 'react';
import './App.css';
import { Fluence, kras } from '@fluencelabs/js-client';
import { render } from './main';

export default function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [jsContent, setjsContent] = useState('');

  useEffect(() => {
    setTimeout(async () => {
      await Fluence.connect(kras[8]);
      console.log(kras[8].multiaddr);
      console.log('connected => ', await Fluence.getClient().getPeerId());
    }, 0);
  }, []);

  const loadJavaScriptFileAsync = async (url: any) => {
    try {
      const response = await fetch(url);
      const scriptContent = await response.text();
      const htmlString = `<canvas style="position: fixed; top: 60px; left: 30px;" id="mycanvas" width="650" height="450" style="background-color: #31f0f0; margin: 125px 0px 125px 295px;">
      I'm sorry your browser version does not support canvas <!--Fallback Content-->
    </canvas>`;

      let interval = setInterval(async () => {
        try {
          if (await Fluence.getClient().getPeerId()) {
            const res = await render(scriptContent, htmlString);
            setHtmlContent(res[1]);
            setjsContent(res[0]);
            clearInterval(interval);
          }
        } catch (err) {
          console.log(err);
        }
      }, 200);

      console.log('Script loaded and executed successfully');
    } catch (error) {
      console.error('Error loading the script:', error);
    }
  };

  const searchUrl = (evt: any) => {
    if (
      evt.target.value.slice(-4) === '.can' &&
      evt.target.value.substring(0, 12) == 'brickbreaker'
    ) {
      console.log('loading');
      const scriptUrl =
        'https://peach-skinny-peacock-476.mypinata.cloud/ipfs/QmQ43ZBafWoqayUGGSwoWNPHNtWcPkGk195e6kPctpLxsa';

      loadJavaScriptFileAsync(scriptUrl);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.textContent = jsContent;
    document.body.appendChild(script);
  }, [htmlContent]);

  return (
    <>
      <input
        className="url"
        placeholder="url"
        // @ts-ignore
        spellcheck="false"
        onChange={(evt) => searchUrl(evt)}
      ></input>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
}
