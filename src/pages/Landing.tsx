import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from '@/components/Footer';
import PrivacyModal from '@/components/PrivacyModal';

const Landing = () => {
  const navigate = useNavigate();
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [ethicsOpen, setEthicsOpen] = React.useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-[url('/background.png')] bg-cover bg-top z-0"
      />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 animate-fadeUp">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 p-3">
                <Sparkles className="text-white w-8 h-8 animate-pulse" />
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight text-center">
                Okra AI
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl text-white/80 font-medium text-center max-w-2xl">
              AI-powered research analyst for startups and innovators. Instantly validate your ideas, analyze competitors, and get actionable insights—beautifully, securely, and fast.
            </h2>
            <Button
              size="lg"
              className="mt-4 bg-white text-black font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
              onClick={() => navigate("/app")}
            >
              Get Started
            </Button>
          </div>
          <div className="mt-20 flex flex-col items-center gap-6 animate-fadeUp">
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-white text-center shadow-md">
                <h3 className="text-lg font-bold mb-2">Market Validation</h3>
                <p className="text-white/80 text-sm">Instantly assess your idea's potential with AI-driven validation and scoring.</p>
              </div>
              <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-white text-center shadow-md">
                <h3 className="text-lg font-bold mb-2">Competitor Insights</h3>
                <p className="text-white/80 text-sm">See real competitors, strengths, and market gaps—no research required.</p>
              </div>
              <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-white text-center shadow-md">
                <h3 className="text-lg font-bold mb-2">Actionable Reports</h3>
                <p className="text-white/80 text-sm">Get beautiful, shareable reports with pricing, forecasts, and more.</p>
              </div>
            </div>
          </div>
        </main>
        <Footer 
          onPrivacyClick={() => setPrivacyOpen(true)} 
          onEthicsClick={() => setEthicsOpen(true)}
        />
        <PrivacyModal
          open={privacyOpen}
          onClose={() => setPrivacyOpen(false)}
          title="Privacy Policy"
        >
          {`Effective Date: May 2, 2025

Okra (“Platform,” “we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our Platform, including any AI-based tools or services we provide.

1. Information We Collect
We may collect the following types of information:

a. Personal Information
Information you voluntarily provide, such as:
- Name
- Email address
- Any additional contact details
- Content or inputs provided to AI tools (if associated with a user identity)

b. Usage Data
Automatically collected information such as:
- IP address
- Browser type and version
- Operating system
- Date and time of your visit
- Pages viewed and time spent
- Referring/exit pages
- Clickstream data

c. Cookies and Tracking Technologies
We use cookies, pixels, and similar technologies for analytics and functionality. You can disable cookies through your browser settings.

2. How We Use Your Information
We use collected information for the following purposes:
- To operate, manage, and maintain the Platform.
- To improve the performance and accuracy of AI systems.
- To personalize your experience.
- To respond to queries or support requests.
- For data analysis and system monitoring.
- To comply with legal obligations.

3. Sharing and Disclosure
We do not sell your data. However, we may share your data in the following situations:
- With service providers who support our infrastructure, under strict data protection agreements.
- With law enforcement or government agencies when required by law.
- In case of business transitions, such as mergers or acquisitions.

4. Data Storage and Security
We employ industry-standard security practices including:
- SSL encryption
- Access control protocols
- Regular vulnerability scans
Despite our efforts, no digital transmission or storage system is completely secure. Use at your own discretion.

5. Your Rights
Depending on your jurisdiction, you may have the following rights:
- Access to your data
- Correction of inaccurate data
- Deletion or restriction of processing
- Data portability
- Withdrawal of consent
- Lodging a complaint with a regulatory authority

For inquiries, contact us at: support@neuralarc.ai
`}
        </PrivacyModal>
        <PrivacyModal
          open={ethicsOpen}
          onClose={() => setEthicsOpen(false)}
          title="Responsible AI & Disclaimer"
        >
          {`
Responsible AI Use Policy
We are committed to developing and deploying AI responsibly. AI technologies hosted on https://okra-woad.vercel.app are designed to augment human decision-making, not replace it.

Our Principles
1. Transparency
- Clear communication when users are interacting with AI.
- Explanation of how results are generated wherever feasible.

2. Human Oversight
- AI suggestions or outputs should be reviewed by a qualified human.
- Critical or sensitive decisions (e.g., legal or health matters) must not be made solely based on AI output.

3. Robustness and Safety
- We test AI systems to identify and minimize errors and unintended consequences.
- Feedback mechanisms are built to report inappropriate or harmful behavior.

4. Privacy-Aware Design
- Minimal collection of personal data.
- Short-term retention of user inputs (only if necessary).

5. Purpose Limitation
- AI tools are deployed only for clearly defined, ethical, and socially beneficial use cases.

Ethical AI Guidelines
We believe AI should benefit all users and be governed by principles that uphold fairness, accountability, and human dignity.

Key Values
1. Fairness & Non-Discrimination
- Our AI models are evaluated to reduce bias and promote inclusive use.
- Discriminatory or harmful content generation is actively monitored and filtered.

2. Accountability
- We accept responsibility for the behavior and consequences of our AI systems.
- We encourage users to report concerns via [Insert Contact Email].

3. Autonomy
- Users are empowered to understand and control their interaction with AI.
- AI should never manipulate, coerce, or deceive.

4. Do No Harm
- We design AI tools with safeguards to prevent misuse, harm, or exploitation.
- Malicious use of AI tools is prohibited.

5. Accessibility
- We strive to make the Platform accessible and usable by people of all backgrounds and abilities.

 Disclaimer
Please read this Disclaimer carefully before using the Platform.

The tools and content available at https://okra-woad.vercel.app are provided "as is" and are intended for informational and experimental purposes only. By using the Platform, you acknowledge and agree to the following:

1. No Professional Advice
The AI-generated outputs are not a substitute for professional advice in:
- Legal
- Medical
- Financial
- Psychological
or any other regulated domain. Always consult a licensed professional.

2. Limitation of Liability
We shall not be held liable for:
- Any direct or indirect loss or damage arising from reliance on AI outputs.
- Errors, inaccuracies, or omissions in the AI-generated content.
- Unintended consequences or misuse of AI tools.

3. User Responsibility
You are solely responsible for:
- The content you input into the system.
- How you use and interpret the output.
- Ensuring your use complies with applicable laws and ethical norms.

4. AI Limitations
Our AI tools may:
- Generate incorrect or misleading results.
- Fail to understand context or nuance.
- Produce biased or inappropriate content.

Use discretion and critical judgment when using the Platform.
`}
        </PrivacyModal>
      </div>
    </div>
  );
};

export default Landing; 