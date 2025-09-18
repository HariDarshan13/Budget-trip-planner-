import { Button } from '@/components/ui/button';
import { UserCheck, Settings, Sparkles, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: UserCheck,
      step: '01',
      title: 'Sign Up & Authenticate',
      description: 'Create your account and set up your traveler profile in seconds.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Settings,
      step: '02',
      title: 'Set Preferences',
      description: 'Tell us your budget, interests, travel dates, and accommodation preferences.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      step: '03',
      title: 'AI Magic Happens',
      description: 'Our AI analyzes your preferences and creates a personalized itinerary instantly.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Download,
      step: '04',
      title: 'Export & Enjoy',
      description: 'Download your itinerary, access offline, and embark on your perfect trip!',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-travel-cloud">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From sign-up to your dream trip in just 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connection Line (only between steps) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 transform translate-x-4"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="card-float max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Tamil Nadu Adventure?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of travelers who've discovered their perfect trip with TripPlan TN
            </p>
            <Button
              className="btn-hero text-lg px-8 py-4"
              onClick={() => navigate('/preferences')}
            >
              Start Planning for Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
