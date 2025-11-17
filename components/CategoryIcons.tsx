import React from 'react';

// Define individual icon components
const FoodIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a1 1 0 11-2 0v-1H9a1 1 0 01-1-1V5a1 1 0 011-1v-.5z" /><path d="M5.506 3.033A1.5 1.5 0 016.75 2.25a1.5 1.5 0 011.244.783V4.5a.5.5 0 01-1 0V3.313a.5.5 0 00-.75-.433L6 3.313V4.5a.5.5 0 01-1 0V3.033zM15.002 11.5a5.002 5.002 0 01-10 0 5.002 5.002 0 0110 0z" /></svg>;
const HealthIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586l-.828-.828A2 2 0 015.172 4H4zm10 8a1 1 0 100-2H6a1 1 0 100 2h8z" clipRule="evenodd" /></svg>;
const EducationIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M10.394 2.08a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const EnvironmentIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.52-1.937c.563-.149 1.156.029 1.62.46l.06.06a6.01 6.01 0 01-7.72 8.827 6.01 6.01 0 01-2.06-1.551 6.012 6.012 0 01-1.6-4.573z" clipRule="evenodd" /></svg>;
const AnimalsIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M11.933 4.243a2 2 0 012.134.305l2.646 2.117a2 2 0 01.305 2.134l-.883 1.766a2 2 0 01-1.922 1.142h-1.32a2 2 0 00-1.922 1.142l-.883 1.766a2 2 0 01-2.134.305l-2.646-2.117a2 2 0 01-.305-2.134l.883-1.766A2 2 0 018.68 8.007h1.32c.76 0 1.448-.44 1.81-1.142l.883-1.766zM13 2.25a2.75 2.75 0 00-2.348 1.44l-.883 1.766a.25.25 0 01-.226.144H8.226a.25.25 0 01-.226-.144l-.883-1.766A2.75 2.75 0 004.768 2.25H4.5A2.25 2.25 0 002.25 4.5v11A2.25 2.25 0 004.5 17.75h11A2.25 2.25 0 0017.75 15.5V4.5A2.25 2.25 0 0015.5 2.25h-.268z" clipRule="evenodd" /></svg>;
const ChildrenIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const EntrepreneurshipIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>;
const OtherIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;


export const categoryIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "food": FoodIcon,
  "health": HealthIcon,
  "education": EducationIcon,
  "environment": EnvironmentIcon,
  "animals": AnimalsIcon,
  "children": ChildrenIcon,
  "entrepreneurship": EntrepreneurshipIcon,
  "other": OtherIcon,
};

export const getCategoryIcon = (categoryKey: string, className: string = "h-5 w-5"): React.ReactNode => {
    const IconComponent = categoryIcons[categoryKey] || OtherIcon;
    return <IconComponent className={className} />;
}