// index.tsx
export default function Home() {
  return (
    <div>
      <h1>Welcome to Pineapple</h1>
      <p>Your social commerce platform for a connected and engaging shopping experience.</p>
    </div>
  );
}

export function getStaticProps() {
  return {
    props: {
      showHeader: false, // Tell _app.tsx not to show the header on this page
    },
  };
}
