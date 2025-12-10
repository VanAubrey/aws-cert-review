import Link from 'next/link';
import { BookOpen, Award, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Real Exam Questions',
      description: 'Practice with questions similar to actual AWS certification exams',
    },
    {
      icon: Clock,
      title: 'Timed & Untimed Modes',
      description: 'Practice at your own pace or simulate real exam conditions',
    },
    {
      icon: CheckCircle2,
      title: 'Instant Feedback',
      description: 'Get immediate results and detailed explanations for each question',
    },
    {
      icon: Award,
      title: 'Track Your Progress',
      description: 'Monitor your performance and identify areas for improvement',
    },
  ];

  const exams = [
    {
      code: 'CLF-C02',
      title: 'AWS Certified Cloud Practitioner',
      description: 'Foundational understanding of AWS Cloud',
      duration: '90 minutes',
      questions: '65 questions',
    },
    {
      code: 'SAA-C03',
      title: 'AWS Certified Solutions Architect - Associate',
      description: 'Design distributed systems on AWS',
      duration: '130 minutes',
      questions: '65 questions',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AWS CertReview</h1>
          </div>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Master AWS Certifications
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Practice with real exam questions and achieve your AWS certification goals
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Practicing Now
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose AWS CertReview?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Available Exams Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Available Practice Exams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {exams.map((exam, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">{exam.code}</span>
                  <Award className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">{exam.title}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {exam.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {exam.questions}
                  </span>
                </div>
                <Link href="/dashboard">
                  <Button className="w-full">Start Practice Exam</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 AWS CertReview. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}