"use client";
import { getOptions } from "@/lib/getHtmlParseOptions";
import parse from "html-react-parser";
import { ReactNode, useEffect, useState } from "react";

const RichTextParser = ({
  html,
  className,
  setLoading,
  autoplay,
}: {
  html: string;
  className?: string;
  setLoading?: (val: boolean) => void;
  autoplay?: boolean;
}) => {
  const [parsedText, setParsedText] = useState<ReactNode>("");

  useEffect(() => {
    const parserOptions = getOptions(className, autoplay);
    setParsedText(parse(html, parserOptions));
    if (setLoading) setLoading(true);
  }, [html, className]);
  return (
    <div className={`flex flex-col gap-2 overflow-y-auto h-full w-full max-w-[800px] ${className ? className : ""} `}>
      {parsedText}
    </div>
  );
};

export default RichTextParser;
