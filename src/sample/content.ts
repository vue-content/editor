import { LocalizedInMemorySource } from '@vue-content/core'

// Please note that this is the simplest source possible, it can be replaced with any other content source
export const contentSource = new LocalizedInMemorySource('en', {
  en: {
    title: 'Vue content editor',
    card: {
      editSample:
        'Experiment with files inside the <code>src/sample</code> folder to see the how a simple setup could look.',
      countResult: 'count is {{ count }}'
    },
    moreInfo: `
                <p>Check out <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite starter</p>
                <p>Install <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a> in your IDE for a better DX</p>
                <p>Click on the Vite and Vue logos to learn more</p>
            `,
    currentLocale: 'Current locale: {{ locale }}'
  },
  se: {
    title: 'Vue content editor',
    card: {
      editSample:
        'Experimentera med filerna i mappen <code>components/HelloWorld.vue</code> för att se hur en grunduppsättning kan se ut.',
      countResult: 'count är {{ count }}'
    },
    moreInfo: `
                <p>Spana in <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, den officiella Vue + Vite startern</p>
                <p>Installera <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a> i din IDE för bättre DX</p>
                <p>Klicka på Vite- och Vue-loggorna för att lära dig mer</p>
            `,
    currentLocale: 'Vald översättning: {{ locale }}'
  }
})
