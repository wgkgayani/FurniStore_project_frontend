import { useEffect } from "react";

function FastBot() {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://app.fastbots.ai/embed.js";
    script.defer = true;
    script.setAttribute("data-bot-id", "cmqjjom9u009zph28tj7jv9gr");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

export default FastBot;
