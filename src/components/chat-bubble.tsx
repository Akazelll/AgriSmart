"use client";
import { useState } from "react";
import { TbMessageCircleFilled } from "react-icons/tb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {Card, CardFooter} from "./ui/card";
import {X, Send}from "lucide-react";

export function ChatBubble(){
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className='fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4 drop-shadow-2xl'>
        {isOpen && (
          <Card className='w-[350px] shadow-2xl border-stone-200 animate-in slide-in-from-bottom-5 fade-in duration-300 mb-2'>

            <CardFooter className='p-3 border-t bg-white'>
              <form
                className='flex w-full gap-2'
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  placeholder='Ketik pesan...'
                  className='flex-1 focus-visible:ring-emerald-600'
                />
                <Button
                  type='submit'
                  size='icon'
                  className='bg-[#3A6F43] hover:bg-emerald-800'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </form>
            </CardFooter>
          </Card>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-24 w-24 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen
              ? "bg-stone-200 text-stone-600 hover:bg-stone-300"
              : "bg-[#3A6F43] text-white hover:bg-emerald-800"
          }`}
        >
          {isOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <TbMessageCircleFilled className='h-full w-full size-lg' />
          )}
        </Button>
      </div>
    );
}