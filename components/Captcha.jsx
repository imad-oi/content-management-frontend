'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { setCaptchaVerified } from '@/utils/captchaUtils';
import { useEffect, useRef, useState } from 'react';

export default function Captcha({onVerify}) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const text = Math.random().toString(36).substring(2, 8);
    setCaptchaText(text);
    renderCaptcha(text);
  };

  const renderCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Add some noise
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Render text with slight rotation for each character
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 20, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      onVerify(true);
      setCaptchaVerified();
      toast({
        title: "CAPTCHA Verified",
        description: "You have successfully verified the CAPTCHA.",
      });
    } else {
      toast({
        title: "CAPTCHA Incorrect",
        description: "Please try again.",
        variant: "destructive",
      });
      generateCaptcha();
      setUserInput('');
      inputRef.current.focus();
    }
  };

  const regenerateCaptcha = () => {
    generateCaptcha();
    setUserInput('');
    inputRef.current.focus();
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle id="captcha-title">CAPTCHA Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} aria-labelledby="captcha-title">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="captcha-input">Enter the text you see in the image:</Label>
              <canvas
                ref={canvasRef}
                width={200}
                height={60}
                aria-label="CAPTCHA image"
                className="mb-2 pointer-events-none bg-white border border-gray-300 rounded-md"
              />
              <Button type="button" onClick={regenerateCaptcha} className="mb-2">
                Regenerate CAPTCHA
              </Button>
              <Input
                id="captcha-input"
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter CAPTCHA"
                required
                aria-required="true"
                aria-describedby="captcha-description"
              />
              <p id="captcha-description" className="sr-only">
                Enter the characters you see in the image above. If you can't read the image, use the Regenerate CAPTCHA button to get a new image.
              </p>
            </div>
          </div>
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full">Verify CAPTCHA</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}