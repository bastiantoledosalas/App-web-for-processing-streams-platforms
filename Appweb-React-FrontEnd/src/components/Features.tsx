import React from 'react';
import { Brain, Zap, Clock, Shield } from 'lucide-react';

const features = [
  {
    name: 'AI-Powered Insights',
    description: 'Get intelligent suggestions and insights to optimize your workflow.',
    icon: Brain,
  },
  {
    name: 'Lightning Fast',
    description: 'Blazing fast performance with real-time updates and synchronization.',
    icon: Zap,
  },
  {
    name: 'Time Tracking',
    description: 'Automatic time tracking and productivity analytics.',
    icon: Clock,
  },
  {
    name: 'Enterprise Security',
    description: 'Bank-grade security with end-to-end encryption.',
    icon: Shield,
  },
];

export default function Features() {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to be productive
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            TaskFlow AI combines powerful features with an intuitive interface to help you achieve more.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}