import { Html, Head, Main, NextScript } from "next/document";


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Scroll animations hide things only when JS is on, so nothing stays hidden without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {/* Array, the dotted accent face, only used for a couple of lines */}
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=array@400&display=swap" />
        {/* Impact (affiliate network) site verification, exactly as Impact gave it */}
        <meta name="impact-site-verification" value="1249c923-692c-4175-ab20-3df279c21b24" />
        {/* Impact's tracking script, exactly as Impact gave it: verifies the site and
            turns links to partner brands into tracked affiliate links */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html:
              "(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A8119547-0860-43fa-bd3c-b7de0463f5691.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');",
          }}
        />
        {/* Google AdSense, loaded once for every page */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4949825107605621"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
