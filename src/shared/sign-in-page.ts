export function signInPage(succeeded: boolean, nonce: string, provider?: 'ChatGPT' | 'OpenRouter') {
  return {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    },
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${succeeded ? 'Signed in' : 'Sign-in failed'} · Wea</title>
  <style nonce="${nonce}">
    :root { color-scheme: light dark; --background: #fdfcfe; --foreground: #211c28; --muted: #6d6273; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 32px 24px; background: var(--background); color: var(--foreground); font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
    main { width: min(100%, 400px); text-align: center; }
    .brand { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 40px; font-size: 26px; font-weight: 650; letter-spacing: -1px; }
    .brand svg { width: 36px; height: 36px; }
    h1 { margin: 0 0 12px; font-size: 28px; font-weight: 600; letter-spacing: -.8px; line-height: 1.2; }
    p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.7; }
    button { margin-top: 24px; border: 0; border-radius: 999px; padding: 12px 20px; background: #067a8f; color: #ffffff; font: inherit; cursor: pointer; }
    button:hover { background: #05616f; }
    button:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
    @media (prefers-color-scheme: dark) { :root { --background: #1e1b21; --foreground: #f5f1f6; --muted: #ada4b6; } button { background: #07c2e4; color: #142134; } button:hover { background: #38d3ee; } }
  </style>
</head>
<body>
  <main aria-labelledby="title">
    <div class="brand"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><svg x="0" y="0" width="32" height="32" viewBox="0 0 512 512"><path fill="#0698B2" d="M256 8 A248 248 0 1 1 255.99 8 Z"/><g transform="translate(256 262) scale(1.22) translate(-256 -273)"><path fill="#FFFFFF" d="M116.34 256.71 L118.93 261.08 L122.19 267.30 L133.22 290.09 L135.93 295.53 L138.80 301.04 L141.71 306.30 L144.03 310.28 L147.24 315.40 L149.69 319.00 L152.71 323.09 L156.62 327.84 L159.83 331.28 L163.37 334.64 L167.30 337.87 L170.61 340.21 L174.10 342.34 L178.18 344.41 L180.98 345.59 L183.92 346.63 L188.16 347.78 L191.35 348.39 L193.40 348.67 L196.72 348.94 L199.82 348.99 L202.71 348.87 L205.59 348.59 L208.43 348.16 L211.22 347.58 L213.95 346.85 L216.60 345.99 L219.16 345.01 L222.65 343.42 L224.99 342.18 L227.23 340.86 L229.36 339.46 L232.37 337.24 L234.21 335.74 L236.82 333.39 L238.44 331.80 L240.61 329.49 L242.82 326.93 L244.59 324.68 L246.55 322.01 L248.76 318.74 L250.77 315.49 L252.62 312.27 L256.00 305.79 L259.17 311.89 L262.22 317.11 L265.45 322.01 L268.67 326.29 L272.02 330.18 L275.18 333.39 L278.71 336.51 L280.62 338.01 L282.64 339.46 L284.77 340.86 L287.01 342.18 L290.37 343.92 L292.84 345.01 L295.40 345.99 L299.66 347.30 L302.43 347.94 L305.24 348.43 L309.29 348.87 L312.18 348.99 L314.05 348.98 L318.60 348.67 L320.65 348.39 L323.84 347.78 L326.91 346.99 L329.86 346.02 L332.68 344.91 L335.36 343.68 L337.90 342.34 L340.29 340.91 L342.56 339.42 L345.77 337.04 L347.78 335.38 L350.45 332.97 L352.17 331.28 L354.82 328.46 L356.88 326.10 L359.29 323.09 L362.31 319.00 L365.69 313.97 L369.07 308.43 L372.20 302.88 L375.13 297.36 L377.95 291.77 L387.66 271.64 L390.49 265.95 L393.07 261.08 L395.66 256.71 L397.30 256.00 L399.11 255.07 L400.84 254.02 L402.51 252.87 L404.10 251.60 L405.60 250.24 L407.01 248.78 L408.32 247.23 L409.52 245.60 L410.62 243.89 L411.60 242.12 L412.46 240.28 L413.21 238.39 L413.82 236.46 L414.31 234.49 L414.67 232.49 L414.90 230.48 L415.00 228.45 L414.96 226.42 L414.79 224.40 L414.49 222.40 L414.06 220.42 L413.50 218.47 L412.81 216.56 L412.00 214.70 L411.07 212.89 L410.02 211.16 L408.87 209.49 L407.60 207.90 L406.24 206.40 L404.78 204.99 L403.23 203.68 L401.60 202.48 L399.89 201.38 L398.12 200.40 L396.28 199.54 L394.39 198.79 L392.46 198.18 L390.49 197.69 L388.49 197.33 L386.48 197.10 L384.45 197.00 L382.42 197.04 L380.06 197.20 L377.70 197.52 L374.80 198.10 L371.31 199.11 L368.10 200.35 L364.38 202.18 L361.74 203.77 L359.35 205.43 L356.02 208.13 L353.44 210.56 L351.06 213.10 L348.32 216.38 L345.89 219.65 L343.68 222.92 L340.66 227.84 L336.98 234.47 L332.72 242.86 L323.93 261.12 L320.85 267.34 L317.08 274.44 L314.91 278.21 L313.05 281.19 L311.11 277.36 L309.08 272.97 L303.10 259.04 L300.65 253.53 L298.64 249.29 L296.38 244.94 L293.77 240.45 L292.21 238.06 L290.60 235.79 L288.78 233.45 L287.43 231.87 L284.34 228.68 L282.56 227.07 L280.58 225.48 L278.41 223.92 L276.67 222.82 L274.06 221.37 L271.21 220.05 L267.45 218.71 L264.20 217.87 L261.54 217.40 L257.36 217.03 L253.90 217.06 L251.18 217.30 L247.08 218.03 L243.85 218.93 L240.79 220.05 L237.94 221.37 L235.99 222.43 L233.59 223.92 L230.77 225.98 L227.66 228.68 L224.57 231.87 L221.99 235.01 L219.79 238.06 L217.87 241.03 L215.62 244.94 L213.91 248.20 L212.00 252.12 L210.10 256.30 L202.40 274.11 L200.39 278.38 L198.95 281.19 L195.65 275.75 L191.92 268.83 L188.07 261.12 L178.45 241.17 L175.79 235.93 L173.06 230.85 L170.13 225.80 L166.88 220.76 L163.68 216.38 L160.94 213.10 L158.56 210.56 L156.77 208.84 L154.81 207.12 L152.65 205.43 L149.46 203.27 L146.82 201.75 L144.70 200.70 L140.69 199.11 L137.20 198.10 L134.30 197.52 L131.94 197.20 L129.58 197.04 L127.55 197.00 L125.52 197.10 L123.51 197.33 L121.51 197.69 L119.54 198.18 L117.61 198.79 L115.72 199.54 L113.88 200.40 L112.11 201.38 L110.40 202.48 L108.77 203.68 L107.22 204.99 L105.76 206.40 L104.40 207.90 L103.13 209.49 L101.98 211.16 L100.93 212.89 L100.00 214.70 L99.19 216.56 L98.50 218.47 L97.94 220.42 L97.51 222.40 L97.21 224.40 L97.04 226.42 L97.00 228.45 L97.10 230.48 L97.33 232.49 L97.69 234.49 L98.18 236.46 L98.79 238.39 L99.54 240.28 L100.40 242.12 L101.38 243.89 L102.48 245.60 L103.68 247.23 L104.99 248.78 L106.40 250.24 L107.90 251.60 L109.49 252.87 L111.16 254.02 L112.89 255.07 L114.70 256.00 Z"/></g></svg></svg><span>Wea</span></div>
    <h1 id="title">${succeeded ? `${provider ?? 'Your model'} is connected` : 'Sign-in didn’t finish'}</h1>
    <p>${succeeded ? 'You can close this tab and return to Wea.' : 'Return to Wea and try connecting again.'}</p>
    ${succeeded ? '<button type="button" id="close">Close page</button>' : ''}
  </main>
  <script nonce="${nonce}">
    try { history.replaceState(null, '', location.pathname); } catch {}
    ${succeeded ? "document.getElementById('close').addEventListener('click', () => window.close()); window.close();" : ''}
  </script>
</body>
</html>`,
  };
}
