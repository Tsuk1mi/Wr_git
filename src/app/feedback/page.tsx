"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2, MessageSquare, Send, ThumbsUp, Bug, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Схема валидации формы
const feedbackSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов" }),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  feedbackType: z.string({
    required_error: "Выберите тип обратной связи",
  }),
  message: z.string().min(10, { message: "Сообщение должно содержать не менее 10 символов" }),
});

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      feedbackType: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    setIsSubmitting(true);

    // Имитация отправки данных
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(values);
    setIsSubmitting(false);
    setIsSuccess(true);
    form.reset();
  };

  // Функция для получения иконки типа фидбека
  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case "suggestion":
        return <MessageSquare className="h-4 w-4" />;
      case "bug":
        return <Bug className="h-4 w-4" />;
      case "praise":
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад на главную</span>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 animate-fadeIn">
              <MessageSquare className="h-7 w-7 text-primary" />
              Обратная связь
            </h1>
            <p className="text-muted-foreground mb-6 animate-fadeIn" style={{ animationDelay: "100ms" }}>
              Мы ценим ваше мнение и постоянно работаем над улучшением приложения
            </p>

            <Card className="shadow-md animate-fadeIn overflow-hidden" style={{ animationDelay: "200ms" }}>
              <CardHeader className="bg-gradient-to-r from-muted/50 to-background">
                <CardTitle>Отправьте нам сообщение</CardTitle>
                <CardDescription>
                  Расскажите нам о вашем опыте использования WeatherWear или предложите новые функции
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center animate-fadeIn">
                    <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">Спасибо за ваш отзыв!</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      Мы получили ваше сообщение и рассмотрим его в ближайшее время. Ваше мнение помогает нам становиться лучше.
                    </p>
                    <Button className="mt-6" onClick={() => setIsSuccess(false)}>
                      Отправить ещё одно сообщение
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="animate-fadeIn" style={{ animationDelay: "300ms" }}>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input placeholder="Ваше имя" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="animate-fadeIn" style={{ animationDelay: "400ms" }}>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Ваш email адрес" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="feedbackType"
                        render={({ field }) => (
                          <FormItem className="animate-fadeIn" style={{ animationDelay: "500ms" }}>
                            <FormLabel>Тип обратной связи</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите тип обратной связи" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="suggestion" className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-500" />
                                    <span>Предложение</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="bug" className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <Bug className="h-4 w-4 text-red-500" />
                                    <span>Сообщение об ошибке</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="praise" className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4 text-green-500" />
                                    <span>Благодарность</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="other" className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-zinc-400" />
                                    <span>Другое</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="animate-fadeIn" style={{ animationDelay: "600ms" }}>
                            <FormLabel>Сообщение</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Расскажите нам более подробно..." rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full animate-fadeIn"
                        style={{ animationDelay: "700ms" }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Отправить отзыв
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
