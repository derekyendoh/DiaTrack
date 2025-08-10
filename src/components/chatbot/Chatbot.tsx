
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QuickReplyOptions = [
  "What is a healthy BMI?",
  "How can I reduce my risk?",
  "What is HbA1c?",
  "Signs of diabetes",
  "Diet recommendations"
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Diabetes Sense assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowercasedMessage = userMessage.toLowerCase();
    
    if (lowercasedMessage.includes('bmi') || lowercasedMessage.includes('body mass')) {
      return "A healthy BMI is typically between 18.5 and 24.9. BMI is calculated as weight (kg) divided by height squared (m²).";
    } else if (lowercasedMessage.includes('reduce risk') || lowercasedMessage.includes('lower risk')) {
      return "You can reduce your diabetes risk through: regular physical activity, maintaining a healthy weight, eating a balanced diet rich in whole grains and vegetables, limiting processed foods and sugars, and regular health check-ups.";
    } else if (lowercasedMessage.includes('hba1c')) {
      return "HbA1c is a blood test that measures your average blood sugar levels over the past 2-3 months. For people without diabetes, normal levels are below 5.7%. Prediabetes is 5.7% to 6.4%, and diabetes is 6.5% or higher.";
    } else if (lowercasedMessage.includes('sign') || lowercasedMessage.includes('symptom')) {
      return "Common signs of diabetes include: increased thirst and urination, fatigue, blurred vision, unexpected weight loss, slow wound healing, frequent infections, and tingling or numbness in hands or feet.";
    } else if (lowercasedMessage.includes('diet') || lowercasedMessage.includes('food') || lowercasedMessage.includes('eat')) {
      return "A diabetes-friendly diet includes: non-starchy vegetables, lean proteins, whole grains, healthy fats, minimal added sugars and refined carbs. Regular meal timing is also important for managing blood sugar.";
    } else {
      return "I'm here to answer questions about diabetes risk factors, management, and prevention. Feel free to ask me anything specific!";
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-2">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-diabetesSense-accent text-white rounded-tr-none' 
                  : 'bg-secondary text-foreground rounded-tl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-foreground rounded-2xl rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 pb-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {QuickReplyOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleQuickReply(option)}
              className="bg-secondary hover:bg-secondary/80 text-sm px-3 py-1 rounded-full text-foreground transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-2 pt-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
            className="bg-secondary border-none"
          />
          <Button 
            onClick={() => handleSendMessage(input)}
            className="bg-diabetesSense-accent hover:bg-diabetesSense-accent/90"
            size="icon"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
