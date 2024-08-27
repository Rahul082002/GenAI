"use client";

import React, { useState } from "react";
import Image from "next/image"; // Import the Next.js Image component
import { generateImage } from "@/app/api/LLM_Call/route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"

const TextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    try {
      const generatedImage = await generateImage(prompt);
      setImage(generatedImage);
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  return (
    <div className="grid w-full gap-2">
      <Textarea 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt" />
      <Button variant="outline" onClick={handleGenerateImage}>
        Generate Image
      </Button>

      {image && (
        <Image src={image} alt="Generated from text" width={500} height={500} />
      )}
    </div>
  );
};

export default TextToImage;
