// src/pages/PrivacyPolicy.jsx
import React from 'react';
import {
  ShieldCheck,
  BarChart3,
  DollarSign,
  UserCheck,
  Mail,
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4 totheleft display-1">Privacy Policy</h1>

      <p className="lead mb-4">
        Hey there! Thanks for checking out OnlineCourseCompare.
      </p>

      <div className="row g-4">
        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100">
            <ShieldCheck className="mb-2 text-primary" size={32} />
            <h4 className="fw-bold">No Personal Info Collected</h4>
            <p className="text-muted">
              I don’t collect names, emails, or anything sensitive. You can
              browse freely, and no signups, no popups, no spam. Just a clean experience.
            </p>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100">
            <BarChart3 className="mb-2 text-success" size={32} />
            <h4 className="fw-bold">Analytics for Improvement</h4>
            <p className="text-muted">
              I use Google Analytics and Vercel Analytics to understand how
              people use the site and what pages get visited, what they search
              for, and how long they stay. This helps me make the site better,
              all without identifying you. so no worries on that!
            </p>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100">
            <DollarSign className="mb-2 text-warning" size={32} />
            <h4 className="fw-bold">Ads & Monetization</h4>
            <p className="text-muted">
              I use Google AdSense to show ads that help keep this site free.
              Some ads might use cookies to personalize content, but you can
              always turn those off in your browser if you'd like.
            </p>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100">
            <UserCheck className="mb-2 text-info" size={32} />
            <h4 className="fw-bold">You're in Control</h4>
            <p className="text-muted">
              You’re just browsing, and that’s perfectly fine. I don’t ask for
              or track anything personal. You’re in full control of your own
              data at all times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
