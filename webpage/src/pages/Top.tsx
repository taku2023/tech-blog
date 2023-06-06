import Header from "@/components/organism/Header";
import "./Top.sass";

const Top = () => {
  return (
    <>
      <Header></Header>
      <main className="top-container bg-accent">
        <h1 className="headline">Write once Read Everyone.</h1>
        <p className="title mt-1">
          Blog about software architecture, test, readability.
        </p>
      </main>
    </>
  );
};

export default Top;
