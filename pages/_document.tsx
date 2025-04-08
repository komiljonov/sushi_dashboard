// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="uz">
        <Head>
          <meta name="description" content="Sushi Yummy Dashboard" /> 
          <link rel="icon" href="/images/logo2.svg" type="image/svg" />
        <link rel="apple-touch-icon" href="/images/logo2.svg" />
        </Head>
        <body className='bg-white'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;