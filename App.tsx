import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  User, 
  Briefcase, 
  Code, 
  Cpu, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Star, 
  Mail, 
  X, 
  Minus, 
  Wifi,
  Battery,
  Search,
  ExternalLink,
  Download,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  Monitor,
  Maximize2,
  Settings,
  Image as ImageIcon,
  Power,
  RefreshCw,
  LogOut,
  Info,
  Music,
  Calculator,
  Lock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Bell,
  ChevronRight
} from 'lucide-react';

// --- Types ---

type AppId = 'home' | 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'publications' | 'honors' | 'contact' | 'settings' | 'terminal' | 'music' | 'calculator';

interface AppConfig {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  color: string;
  defaultSize?: { w: number, h: number };
}

interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WindowState extends WindowRect {
  id: AppId;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevRect?: WindowRect; // To restore size after maximize
}

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
}

// --- Data Constants ---

const APPS: AppConfig[] = [
  { id: 'home', title: 'Profile', icon: <User size={24} />, color: 'bg-blue-500' },
  { id: 'about', title: 'About', icon: <Info size={24} />, color: 'bg-emerald-500' },
  { id: 'experience', title: 'Experience', icon: <Briefcase size={24} />, color: 'bg-amber-500' },
  { id: 'projects', title: 'Projects', icon: <Code size={24} />, color: 'bg-purple-500' },
  { id: 'skills', title: 'Skills', icon: <Cpu size={24} />, color: 'bg-rose-500' },
  { id: 'education', title: 'Education', icon: <GraduationCap size={24} />, color: 'bg-cyan-500' },
  { id: 'certifications', title: 'Certificates', icon: <Award size={24} />, color: 'bg-indigo-500' },
  { id: 'publications', title: 'Research', icon: <BookOpen size={24} />, color: 'bg-pink-500' },
  { id: 'honors', title: 'Honors', icon: <Star size={24} />, color: 'bg-yellow-400' },
  { id: 'contact', title: 'Contact', icon: <Mail size={24} />, color: 'bg-green-600' },
  { id: 'terminal', title: 'Terminal', icon: <Terminal size={24} />, color: 'bg-gray-800', defaultSize: { w: 700, h: 500 } },
  { id: 'music', title: 'Music', icon: <Music size={24} />, color: 'bg-red-500', defaultSize: { w: 350, h: 500 } },
  { id: 'calculator', title: 'Calculator', icon: <Calculator size={24} />, color: 'bg-orange-500', defaultSize: { w: 300, h: 450 } },
  { id: 'settings', title: 'Settings', icon: <Settings size={24} />, color: 'bg-slate-600' },
];

const WALLPAPERS = [
  { name: "Nebula", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" },
  { name: "Midnight Peaks", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" },
  { name: "Abstract Flow", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" },
  { name: "Cyberpunk City", url: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=2000&auto=format&fit=crop" },
  { name: "Minimalist", url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2000&auto=format&fit=crop" },
];

// ... (Existing Data: EXPERIENCE_DATA, PROJECTS_DATA, SKILLS_DATA, CERTIFICATIONS_DATA - Kept same)
const EXPERIENCE_DATA = [
  {
    role: "Data Science Intern",
    type: "Internship",
    company: "Uptricks Services Pvt. Ltd.",
    duration: "Oct 2025 – Present",
    location: "Remote",
    details: [
      "Working as a Data Science Intern, applying analytical skills to real-world datasets.",
      "Developing predictive models and contributing to data-driven decision-making processes."
    ]
  },
  {
    role: "Head of Research And Development",
    type: "Part-time",
    company: "KINETEX LAB KIIT CHAPTER",
    duration: "Oct 2025 – Present",
    location: "Bhubaneswar, Odisha",
    details: [
      "Leading research and development initiatives within the KINETEX LAB student chapter.",
      "Overseeing projects from conception to completion in emerging technology domains."
    ]
  },
  {
    role: "Data Analyst Intern",
    type: "Internship",
    company: "Overload Ware Labs AI",
    duration: "Sep 2025 – Present",
    location: "Remote",
    details: [
      "Performing data analysis to extract actionable insights for AI-driven products.",
      "Collaborating with a team of engineers and data scientists in a remote environment."
    ]
  },
  {
    role: "Research Internship",
    type: "Internship",
    company: "IISER Thiruvananthapuram",
    duration: "Apr 2025 – Present",
    location: "Hybrid · Thiruvananthapuram, Kerala",
    details: [
      "Engaged in research focusing on Cloud Services and Cloud Infrastructure.",
      "Contributed to hybrid research projects combining on-site and remote work."
    ]
  },
  {
    role: "Cloud Automation Executive",
    type: "Full-time",
    company: "USC.KIIT",
    duration: "Apr 2025 – Present",
    location: "Hybrid · Bhubaneswar, Odisha",
    details: [
      "Automating cloud infrastructure and processes to improve efficiency and reliability.",
      "Working with a team to manage and scale cloud services in a hybrid model."
    ]
  },
  {
    role: "Team Member",
    type: "Part-time",
    company: "CyberVault KIIT",
    duration: "Sep 2024 – Present",
    location: "On-site · Bhubaneswar, Odisha",
    details: [
      "Contributing as an Executive Team Member in cybersecurity initiatives.",
      "Participating in workshops and events to promote cybersecurity awareness."
    ]
  },
  {
    role: "Cloud Computing Executive",
    type: "Full-time",
    company: "Coding Ninjas: KIIT Chapter",
    duration: "Jul 2024 – Present",
    location: "Bhubaneswar, Odisha",
    details: [
      "Leading initiatives and projects related to Cloud Computing and Cloud Applications.",
      "Mentoring peers and organizing workshops on cloud technologies."
    ]
  },
  {
    role: "Secretary & Operation Team Lead",
    type: "Full-time",
    company: "KITPD2S Society",
    duration: "Sep 2024 – Sep 2025",
    location: "On-site · Bhubaneshwar, Odisha",
    details: [
      "Managed operations and led projects in Cloud Computing, IoT, Research, and Patents.",
      "Served as POC, Domain Lead, and Associate Marketing Head for various events."
    ]
  },
  {
    role: "Data Analyst",
    type: "Internship",
    company: "Coding Samurai",
    duration: "Jul 2025 – Aug 2025",
    location: "Remote",
    details: [
      "Worked as a Data Analyst Intern, focusing on data processing and analysis.",
      "Contributed to projects that required statistical analysis and visualization."
    ]
  },
  {
    role: "Data Analyst",
    type: "Internship",
    company: "Codec Technologies India",
    duration: "Apr 2025 – Jul 2025",
    location: "Remote",
    details: [
      "Participated in a Data Analytics project as an intern.",
      "Utilized Python for data manipulation and analysis to meet project objectives."
    ]
  },
  {
    role: "Zero Trust Cloud Security Intern",
    type: "Internship",
    company: "Zscaler",
    duration: "Jan 2025 – Mar 2025",
    location: "Remote",
    details: [
      "Completed a virtual internship on Zscaler's Zero Trust cloud security.",
      "Gained practical experience in cloud security concepts and technologies."
    ]
  }
];

const PROJECTS_DATA = [
  {
    title: "ICICI vs SBI NIFTY Stock Analysis",
    subtitle: "Econometric & Time-Series Comparison (2011–2021)",
    desc: "A comprehensive, data-driven comparison of ICICI Bank and SBI using over a decade of NIFTY data, exploring financial metrics, time-series behaviors, and macroeconomic context.",
    points: ["Performed econometric modeling and ESG score analysis.", "Analyzed digital banking transformations and trading strategy implications."],
    tech: ["Python", "Econometrics", "Time Series", "Pandas"]
  },
  {
    title: "F1 Historical Data Analysis",
    subtitle: "Interactive EDA of 70+ Years of Racing (1950–2023)",
    desc: "An interactive and statistical exploratory data analysis of Formula 1 history, analyzing race trends, constructor championships, and driver performance using advanced visualizations.",
    points: ["Analyzed trends with interactive charts (races per season, titles).", "Evaluated driver consistency and peak performance with boxplots."],
    tech: ["Python", "Plotly", "Seaborn", "Pandas"]
  },
  {
    title: "UiPath AWS Automation Suite",
    subtitle: "Automated EC2 & S3 Management",
    desc: "An end-to-end automation solution for managing AWS S3 buckets and EC2 instances using UiPath, enabling seamless, enterprise-grade cloud operations.",
    points: ["Automated EC2 provisioning, reducing setup time by 70%.", "Streamlined S3 file operations with automated access control.", "Supported 50+ concurrent cloud operations with built-in error handling."],
    tech: ["UiPath", "AWS SDK", "RPA", "Terraform"]
  },
  {
    title: "Uber Ride Analysis Platform",
    subtitle: "ML-Powered Operational Analytics",
    desc: "A comprehensive data analytics platform for Uber operations, featuring 50+ unique EDAs powered by advanced ML and statistical modeling to optimize pricing and predict churn.",
    points: ["Analyzed over 148,000 bookings to uncover patterns.", "Developed models for revenue optimization and churn prediction."],
    tech: ["Python", "Machine Learning", "Statistical Modeling"]
  },
  {
    title: "FaceMeshX",
    subtitle: "Advanced Face & Expression Detection",
    desc: "A real-time system using MediaPipe and OpenCV to detect and visualize advanced facial features, expressions, head pose, and eye status via webcam.",
    points: ["Achieved real-time 60 FPS facial tracking with 468 landmarks.", "Detected head direction, tilt, eye status, and smiles."],
    tech: ["Python", "OpenCV", "MediaPipe"]
  },
  {
    title: "Gene Expression Bioinformatics",
    subtitle: "Cell-Cycle Phase Prediction with Deep Learning",
    desc: "A lightweight, high-performance hybrid CNN-BiLSTM model for predicting cell-cycle phase from gene expression time-series data.",
    points: ["Achieved >98% prediction accuracy on the benchmark Spellman dataset.", "Developed a compact model with a footprint of less than 50 KB."],
    tech: ["Deep Learning", "CNN", "LSTM", "Bioinformatics"]
  },
  {
    title: "YouTube Trending Video Analytics",
    subtitle: "Cross-Country Trend Analysis",
    desc: "This repository explores, visualizes, and compares trending video patterns across multiple countries using real-world datasets from YouTube to uncover insights on engagement and content preferences.",
    points: ["Uncovered insights on time-to-trend and content preferences.", "Analyzed engagement ratios and cross-country differences."],
    tech: ["Python", "Data Visualization", "Pandas", "Statistics"]
  },
  {
    title: "Cervical Cancer Risk Prediction",
    subtitle: "Deep Learning & Hybrid Model Framework",
    desc: "Develops a sophisticated predictive framework combining classical machine learning, deep neural networks, and hybrid architectures to assess cervical cancer risk based on patient demographics, lifestyle, and clinical data.",
    points: ["Integrated diverse data sources for a holistic risk assessment.", "Leveraged hybrid deep learning models to improve prediction accuracy."],
    tech: ["Deep Learning", "Machine Learning", "Python", "Healthcare AI"]
  },
  {
    title: "Breast Cancer Classification Pipeline",
    subtitle: "End-to-End ML with Explainability",
    desc: "A comprehensive, theory-driven machine learning pipeline for binary classification of breast tumors using the WDBC dataset. It integrates statistical inference, dimensionality reduction, feature engineering, and model interpretability.",
    points: ["Built a robust, explainable, and clinically relevant predictive system.", "Integrated advanced techniques like multivariate analysis and feature engineering."],
    tech: ["Python", "Scikit-learn", "Pandas", "XAI"]
  },
  {
    title: "Customer Churn Prediction",
    subtitle: "Supervised Learning for Telecom",
    desc: "Predicts which telecom customers are likely to stop using the service (churn) using supervised machine learning techniques like Logistic Regression, Random Forest, and XGBoost.",
    points: ["Applied multiple supervised ML models to a real-world business problem.", "Identified key factors contributing to customer churn."],
    tech: ["Python", "Data Analysis", "Random Forest", "XGBoost"]
  },
  {
    title: "Mercedes-Benz Stock Data Analytics",
    subtitle: "Financial Time Series Analysis & Forecasting",
    desc: "Performs end-to-end data analysis, visualization, and time-series forecasting on Mercedes-Benz (MBG.DE) historical stock data, with a heavy emphasis on statistical signal processing and technical indicators.",
    points: ["Extracted temporal, cyclical, and structural patterns in stock movements.", "Visualized volatility, momentum, and trend reversals."],
    tech: ["Python", "Time Series", "Pandas", "Financial Analysis"]
  },
  {
    title: "Ultrasonic Radar System",
    subtitle: "Arduino-Powered Real-Time Object Detection",
    desc: "An Arduino-powered radar system using an HC-SR04 ultrasonic sensor to detect objects and visualize their positions in real-time on a Processing-based GUI.",
    points: ["Built a functional radar system with a 180° scan range.", "Developed a real-time GUI to visualize detected obstacles."],
    tech: ["Arduino", "C++", "Java", "Processing", "IoT"]
  },
  {
    title: "Concurrent Port Scanner",
    subtitle: "Network Security Tool in Python",
    desc: "A Python-based port scanner designed to identify open ports on a specified remote host. It utilizes concurrent threading to efficiently scan a range of ports, providing clear feedback on port status.",
    points: ["Implemented multithreading for efficient, high-speed scanning.", "Created a useful tool for network diagnostics and security assessments."],
    tech: ["Python", "Cybersecurity", "Networking", "Threading"]
  },
  {
    title: "Hull Tactical Market Prediction",
    subtitle: "Deep Learning for Financial Forecasting",
    desc: "A project involving in-depth EDA with 50+ advanced visualizations and a custom deep learning model to predict market movements. It includes feature engineering from diverse data sources and evaluation with finance-specific metrics.",
    points: ["Conducted comprehensive EDA with advanced financial visualizations.", "Engineered features from market, macro, sentiment, and volatility data."],
    tech: ["Deep Learning", "Quantitative Finance", "Python", "Feature Engineering"]
  },
  {
    title: "Iris Species Analysis from Scratch",
    subtitle: "Advanced Neural Network with NumPy",
    desc: "A highly advanced implementation of a neural network for the classic Iris classification problem, built from scratch using only NumPy. It achieves >98% accuracy and incorporates modern techniques like custom activations, batch normalization, and attention mechanisms.",
    points: ["Built a neural network from scratch, achieving >98% test accuracy.", "Implemented advanced features like Swish/GELU activations and batch norm."],
    tech: ["NumPy", "Machine Learning", "Neural Networks", "Python"]
  }
];

const SKILLS_DATA = {
  "Cloud & DevOps (IaC)": ["AWS", "GCP", "Azure", "Terraform", "Kubernetes", "Docker", "Jenkins", "GitHub Actions", "Ansible", "Bash", "Git"],
  "AI/ML & Data Science": ["TensorFlow", "Keras", "Scikit-learn", "OpenCV", "Flask", "Pandas", "NumPy", "XGBoost", "Plotly"],
  "Programming & Databases": ["Python", "C++", "Java", "SQL", "HTML/CSS"]
};

const CERTIFICATIONS_DATA = [
  {
    category: "Google Cloud & Terraform",
    items: ["Google Cloud Cybersecurity Certificate", "Build Infrastructure with Terraform", "Manage Kubernetes in Google Cloud", "Cloud Computing Foundations", "Generative AI Certificate"]
  },
  {
    category: "AWS & Docker",
    items: ["AWS Machine Learning Foundations", "AWS Cloud Essentials", "Basic DevSecOps in AWS", "Basic Docker Training"]
  },
  {
    category: "Linux Foundation & Kubernetes",
    items: ["LFS158: Introduction to Kubernetes", "LFS167: Introduction to Jenkins", "LFS151: Cloud Infrastructure Technologies", "LFD110: Introduction to RISC-V"]
  },
  {
    category: "IBM & Deep Learning",
    items: ["Deep Learning with TensorFlow", "Accelerating Deep Learning with GPUs", "Machine Learning with Python", "Introduction to Quantum Computing", "Containers, Kubernetes, and OpenShift"]
  },
  {
    category: "Microsoft & Data Analysis",
    items: ["Career Essentials in Data Analysis", "Career Essentials in Generative AI", "Analyzing and Visualizing Data with Power BI"]
  },
  {
    category: "freeCodeCamp & Python",
    items: ["Machine Learning with Python", "Data Analysis with Python", "Data Visualization", "Scientific Computing with Python"]
  }
];

// --- Components ---

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm font-medium tabular-nums text-shadow select-none">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

// --- Window Component with Resize Support ---

interface WindowProps {
  app: AppConfig;
  state: WindowState;
  isActive: boolean;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onUpdateState: (id: AppId, newState: Partial<WindowRect>) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ app, state, isActive, onClose, onMinimize, onMaximize, onFocus, onUpdateState, children }) => {
  const dragStartRef = useRef<{ x: number; y: number; rect: WindowRect } | null>(null);
  const [resizeDir, setResizeDir] = useState<string | null>(null);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isMaximized) return;
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    onFocus(app.id);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rect: { x: state.x, y: state.y, width: state.width, height: state.height }
    };
  };

  // Handle Resize Start
  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    e.preventDefault();
    onFocus(app.id);
    setResizeDir(dir);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rect: { x: state.x, y: state.y, width: state.width, height: state.height }
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      
      const { x: startX, y: startY, rect } = dragStartRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (resizeDir) {
        // Resizing Logic
        let newRect = { ...rect };
        const minW = 300;
        const minH = 200;

        if (resizeDir.includes('e')) newRect.width = Math.max(minW, rect.width + deltaX);
        if (resizeDir.includes('s')) newRect.height = Math.max(minH, rect.height + deltaY);
        
        if (resizeDir.includes('w')) {
          const w = Math.max(minW, rect.width - deltaX);
          newRect.width = w;
          newRect.x = rect.x + (rect.width - w);
        }
        if (resizeDir.includes('n')) {
          const h = Math.max(minH, rect.height - deltaY);
          newRect.height = h;
          newRect.y = rect.y + (rect.height - h);
        }
        
        onUpdateState(app.id, newRect);
      } else {
        // Dragging Logic
        onUpdateState(app.id, {
          x: rect.x + deltaX,
          y: rect.y + deltaY
        });
      }
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      setResizeDir(null);
    };

    if (dragStartRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeDir, app.id, onUpdateState]);

  if (state.isMinimized) return null;

  const style: React.CSSProperties = state.isMaximized ? {
    top: '32px', // Below top bar
    left: 0,
    right: 0,
    bottom: '88px', // Above dock area
    zIndex: state.zIndex,
    width: '100%',
    height: 'calc(100vh - 120px)'
  } : {
    top: state.y,
    left: state.x,
    width: state.width,
    height: state.height,
    zIndex: state.zIndex,
  };

  return (
    <div 
      className={`absolute flex flex-col overflow-hidden transition-shadow duration-200 
        ${state.isMaximized ? '' : 'rounded-lg'}
        ${isActive ? 'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] ring-1 ring-white/20' : 'shadow-2xl ring-1 ring-white/10 grayscale-[0.3]'}
        bg-[#1e1e2e]/95 backdrop-blur-xl
      `}
      style={style}
      onMouseDown={() => onFocus(app.id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-10 ${app.color} flex items-center justify-between px-3 select-none flex-shrink-0 relative
          ${state.isMaximized ? '' : 'cursor-default'}
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(app.id)}
      >
        <div className="flex items-center space-x-2 text-white font-semibold text-sm drop-shadow-sm pointer-events-none">
          {app.icon}
          <span>{app.title}</span>
        </div>
        <div className="flex items-center space-x-2" onMouseDown={e => e.stopPropagation()}>
          <button className="p-1.5 hover:bg-white/20 rounded-full text-white/90 transition-colors" onClick={() => onMinimize(app.id)}>
            <Minus size={14} strokeWidth={3} />
          </button>
          <button className="p-1.5 hover:bg-white/20 rounded-full text-white/90 transition-colors" onClick={() => onMaximize(app.id)}>
            {state.isMaximized ? <Minus size={12} className="rotate-90" strokeWidth={3} /> : <Maximize2 size={12} strokeWidth={3} />}
          </button>
          <button className="p-1.5 hover:bg-red-500 rounded-full text-white/90 transition-colors" onClick={() => onClose(app.id)}>
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 text-slate-200 custom-scrollbar relative bg-[#181825]/90">
        <div className="h-full">
          {children}
        </div>
      </div>

      {/* Resize Handles (Only when not maximized) */}
      {!state.isMaximized && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 cursor-ns-resize z-50" onMouseDown={e => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize z-50" onMouseDown={e => handleResizeStart(e, 's')} />
          <div className="absolute top-0 left-0 h-full w-1 cursor-ew-resize z-50" onMouseDown={e => handleResizeStart(e, 'w')} />
          <div className="absolute top-0 right-0 h-full w-1 cursor-ew-resize z-50" onMouseDown={e => handleResizeStart(e, 'e')} />
          
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50" onMouseDown={e => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50" onMouseDown={e => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50" onMouseDown={e => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50" onMouseDown={e => handleResizeStart(e, 'se')} />
        </>
      )}
    </div>
  );
};

// --- View Components ---

const HomeView = () => (
  <div className="h-full p-6 flex flex-col justify-center items-center text-center space-y-6 animate-in fade-in duration-700">
    <div className="relative group cursor-pointer">
      <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white/10 group-hover:scale-105 transition-transform">
        SD
      </div>
      <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-900 animate-pulse"></div>
    </div>
    <div className="space-y-2">
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Hi, I'm Sourish Dey.</h1>
      <p className="text-xl md:text-2xl text-blue-400 font-semibold">A Data Scientist | Cloud Engineer</p>
    </div>
    <p className="max-w-2xl text-lg text-gray-300 leading-relaxed">
      Highly motivated Cloud and Data Science Engineer with 3+ years of experience in building intelligent, scalable, and secure digital ecosystems. Proficient in AWS, MLOps, IaC, and Kubernetes.
    </p>
    <div className="flex flex-wrap gap-4 justify-center pt-6">
      <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
        <Download size={18} /> Download Resume
      </button>
    </div>
  </div>
);

const AboutView = () => (
  <div className="max-w-4xl p-6 mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <section>
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">Professional Profile</h2>
      <p className="text-lg leading-relaxed text-gray-300">
        I am a results-driven engineer with a strong foundation in computer science, currently pursuing a B.Tech at KIIT University. My passion lies at the intersection of AI/ML, cloud infrastructure, and DevOps. I thrive on solving complex problems and am constantly exploring new technologies to build efficient, scalable, and intelligent systems that deliver measurable impact.
      </p>
    </section>
    
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Core Competencies</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          "Cloud Architecture", "MLOps & Model Deployment", "AI/ML Implementation",
          "Predictive Analytics", "Zero Trust Security", "Agile Collaboration",
          "Data-Driven Decision-Making", "Strategic Problem Solving", "Risk Mitigation"
        ].map((skill) => (
          <div key={skill} className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span>{skill}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const ExperienceView = () => (
  <div className="max-w-5xl p-6 mx-auto animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-2">My Professional Journey</h2>
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-500 before:to-transparent">
      {EXPERIENCE_DATA.map((exp, index) => (
        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-800 group-hover:bg-amber-500 transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-white/20 z-10">
            <Briefcase size={16} className="text-white" />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-white/10 bg-white/5 shadow-md hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-white text-lg">{exp.role}</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">{exp.type}</span>
            </div>
            <div className="text-blue-400 font-medium mb-1">{exp.company}</div>
            <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-400 mb-4 gap-2 md:gap-4">
              <span className="flex items-center gap-1"><Calendar size={12} /> {exp.duration}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {exp.location}</span>
            </div>
            <ul className="list-disc list-inside ml-2 space-y-1 text-sm text-gray-300">
              {exp.details.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsView = () => (
  <div className="max-w-6xl p-6 mx-auto animate-in slide-in-from-bottom-4 duration-500">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
      <p className="text-gray-400">Innovations and implementations</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROJECTS_DATA.map((project, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/50 hover:bg-white/10 transition-all flex flex-col h-full group hover:-translate-y-1 hover:shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 group-hover:text-purple-200">
              <Code size={24} />
            </div>
            <ExternalLink size={16} className="text-gray-500 hover:text-white cursor-pointer" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
          <p className="text-xs text-purple-400 font-medium mb-3 uppercase tracking-wide">{project.subtitle}</p>
          <p className="text-sm text-gray-300 mb-4 line-clamp-3">{project.desc}</p>
          
          <div className="flex-1">
             <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 mb-4">
              {project.points.slice(0, 2).map((p, i) => <li key={i} className="line-clamp-1">{p}</li>)}
             </ul>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsView = () => (
  <div className="max-w-4xl p-6 mx-auto animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-2">Technical Skills</h2>
    <div className="grid grid-cols-1 gap-8">
      {Object.entries(SKILLS_DATA).map(([category, skills]) => (
        <div key={category} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
            <Cpu size={24} /> {category}
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <div key={skill} className="px-4 py-2 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-md border border-slate-700 transition-all cursor-default shadow-sm hover:shadow-md">
                <span className="font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EducationView = () => (
  <div className="max-w-4xl p-6 mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">My Academic Journey</h2>
    
    <div className="relative border-l-2 border-cyan-500/30 ml-3 space-y-8 pl-8 py-2">
      <div className="relative group">
        <span className="absolute -left-[41px] top-1 bg-cyan-500 w-6 h-6 rounded-full border-4 border-gray-900 group-hover:scale-110 transition-transform"></span>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <h3 className="text-xl font-bold text-white">Kalinga Institute of Industrial Technology (KIIT)</h3>
            <span className="text-cyan-400 font-mono text-sm">July 2023 – Dec 2027 (Expected)</span>
          </div>
          <p className="text-lg text-gray-200 font-medium mb-4">B.Tech. in Computer Engineering</p>
          <p className="text-sm text-gray-400">
            <span className="text-cyan-200">Relevant Coursework:</span> Data Structures, Algorithms, Operating Systems, DBMS, OOP, Networks, Probability, Statistics
          </p>
        </div>
      </div>

      <div className="relative group">
        <span className="absolute -left-[41px] top-1 bg-gray-700 w-6 h-6 rounded-full border-4 border-gray-900 group-hover:scale-110 transition-transform"></span>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 opacity-80 hover:opacity-100 hover:bg-white/10 transition-all">
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <h3 className="text-xl font-bold text-white">Hem Sheela Model School</h3>
            <span className="text-gray-400 font-mono text-sm">2023</span>
          </div>
          <p className="text-lg text-gray-300">Senior Secondary (AISSCE) — Science</p>
          <div className="mt-2 inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
            Final Score: 91%
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CertificationsView = () => (
  <div className="max-w-5xl p-6 mx-auto animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-2">Certifications & Training</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CERTIFICATIONS_DATA.map((certGroup, idx) => (
        <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-indigo-500/50 transition-all hover:bg-white/10">
          <h3 className="text-lg font-bold text-indigo-300 mb-4 pb-2 border-b border-indigo-500/20">{certGroup.category}</h3>
          <ul className="space-y-3">
            {certGroup.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.6)]"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const PublicationsView = () => (
  <div className="max-w-4xl p-6 mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-2">Publications & Patents</h2>
    <p className="text-gray-400 mb-6">My research and innovations</p>
    
    <div className="space-y-6">
      {[
        {
          title: "IoT and Computer Vision for Urban Traffic Management",
          journal: "International Journal for Multidisciplinary Research (IJFMR)",
          date: "Feb 11, 2025",
          abstract: "A novel smart urban traffic management system synergistically integrating IoT and computer vision. The system employs a hybrid edge-cloud architecture with a distributed network of intelligent IoT devices..."
        },
        {
          title: "Smart Breathe: IoT-Integrated Community Air Purification System",
          journal: "International Journal for Multidisciplinary Research (IJFMR)",
          date: "Dec 18, 2024",
          abstract: "An innovative IoT-integrated air purification system to combat air pollution in high-density urban and industrial areas. Utilizing a distributed architecture, the system employs real-time monitoring..."
        }
      ].map((pub, idx) => (
        <div key={idx} className="bg-white/5 p-6 rounded-xl border-l-4 border-pink-500 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-pink-100">{pub.title}</h3>
          </div>
          <div className="text-sm text-pink-400 mb-3 flex items-center gap-2">
            <BookOpen size={14} /> {pub.journal} <span className="text-gray-500">|</span> {pub.date}
          </div>
          <p className="text-gray-300 text-sm italic leading-relaxed">"{pub.abstract}"</p>
        </div>
      ))}
    </div>
  </div>
);

const HonorsView = () => (
  <div className="max-w-4xl p-6 mx-auto animate-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-2">Honors & Awards</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { title: "School Topper", org: "Hem Sheela Model School", date: "Jan 2023" },
        { title: "Gold Medalist", org: "International Maths Olympiad (SOF)", date: "High School" }
      ].map((honor, idx) => (
        <div key={idx} className="flex items-center space-x-4 bg-gradient-to-r from-yellow-500/10 to-transparent p-4 rounded-xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all">
          <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{honor.title}</h3>
            <div className="text-sm text-gray-400">{honor.org}</div>
            <div className="text-xs text-yellow-500/80 font-mono mt-1">{honor.date}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContactView = () => (
  <div className="max-w-3xl p-6 mx-auto h-full flex flex-col justify-center animate-in zoom-in-95 duration-500">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-white mb-2">Get In Touch</h2>
      <p className="text-gray-400">Let's build something amazing</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center hover:bg-white/10 transition-colors">
        <Mail className="mx-auto text-green-400 mb-4" size={32} />
        <h3 className="font-bold text-white mb-2">Email</h3>
        <p className="text-gray-300 select-all">sourish713321@gmail.com</p>
      </div>
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center hover:bg-white/10 transition-colors">
        <div className="flex justify-center gap-4 mb-4">
           <Linkedin className="text-blue-500" size={32} />
           <Github className="text-white" size={32} />
        </div>
        <h3 className="font-bold text-white mb-2">Socials</h3>
        <p className="text-gray-300">+91-9064648823</p>
      </div>
    </div>
  </div>
);

const SettingsView: React.FC<{ currentWallpaper: string; onSetWallpaper: (url: string) => void }> = ({ currentWallpaper, onSetWallpaper }) => (
  <div className="max-w-4xl p-6 mx-auto animate-in slide-in-from-bottom-4 duration-500 space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">System Settings</h2>
      <p className="text-gray-400">Personalize your experience</p>
    </div>

    <div className="bg-white/5 rounded-xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ImageIcon size={20} /> Wallpaper
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {WALLPAPERS.map((wp, idx) => (
          <div 
            key={idx}
            onClick={() => onSetWallpaper(wp.url)}
            className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105
              ${currentWallpaper === wp.url ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent hover:border-white/30'}
            `}
          >
            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-semibold">{wp.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TerminalView = () => {
  const [history, setHistory] = useState<string[]>(["Welcome to Sourish OS Terminal v1.0.0", "Type 'help' for available commands."]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `root@sourish-pc:~$ ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push("Available commands: help, clear, about, projects, skills, contact, date, whoami");
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'about':
        newHistory.push("Sourish Dey | Cloud & Data Science Engineer | KIIT University");
        break;
      case 'whoami':
        newHistory.push("Visitor (You)");
        break;
      case 'projects':
        newHistory.push("Listed in 'Projects' app. Top: Stock Analysis, Uber Analysis, FaceMeshX.");
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'contact':
        newHistory.push("Email: sourish713321@gmail.com");
        break;
      case '':
        break;
      default:
        newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="h-full bg-black/90 p-4 font-mono text-sm md:text-base overflow-hidden flex flex-col text-green-400">
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="break-words">{line}</div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleCommand} className="flex gap-2 mt-2 pt-2 border-t border-green-500/30">
        <span className="text-green-500 font-bold shrink-0">root@sourish-pc:~$</span>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="bg-transparent border-none outline-none flex-1 text-green-100"
          autoFocus
        />
      </form>
    </div>
  );
};

const CalculatorView = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay("0");
      setExpression("");
    } else if (val === '=') {
      try {
        // Safe-ish eval for a simple portfolio toy
        // eslint-disable-next-line no-eval
        const res = eval(expression.replace(/x/g, '*')); 
        setDisplay(String(res).slice(0, 10));
        setExpression(String(res));
      } catch {
        setDisplay("Error");
      }
    } else {
      const newExpr = expression === "0" ? val : expression + val;
      setExpression(newExpr);
      setDisplay(newExpr);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', 'x',
    '1', '2', '3', '-',
    'C', '0', '=', '+'
  ];

  return (
    <div className="h-full bg-gray-900 flex flex-col p-4 gap-4">
      <div className="bg-gray-800 h-16 rounded-lg flex items-center justify-end px-4 text-3xl font-mono text-white overflow-hidden">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map(btn => (
          <button 
            key={btn}
            onClick={() => handlePress(btn)}
            className={`rounded-lg font-bold text-xl hover:opacity-80 transition-opacity
              ${btn === 'C' ? 'bg-red-500 text-white' : ''}
              ${btn === '=' ? 'bg-green-500 text-white' : ''}
              ${['/','x','-','+'].includes(btn) ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-200'}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

const MusicPlayerView = () => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    let interval: any;
    if (playing) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-black text-white p-6 items-center justify-center space-y-6">
      <div className="w-48 h-48 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center animate-pulse">
        <Music size={64} className="text-white drop-shadow-lg" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold">Lo-Fi Coding Beats</h3>
        <p className="text-indigo-300">Chill Vibes Corp.</p>
      </div>
      <div className="w-full space-y-2">
        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-400 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>1:45</span>
          <span>4:20</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <SkipBack size={24} className="cursor-pointer hover:text-green-400" />
        <button 
          onClick={() => setPlaying(!playing)}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
        >
          {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <SkipForward size={24} className="cursor-pointer hover:text-green-400" />
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <Volume2 size={16} />
        <div className="w-20 h-1 bg-gray-600 rounded-full">
           <div className="w-2/3 h-full bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate check - accept anything
    if (pass.length > 0) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
           <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold">SD</div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Sourish Dey</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <input 
          type="password" 
          placeholder="Enter Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoFocus
          className={`bg-white/10 border ${error ? 'border-red-500 animate-shake' : 'border-white/20'} rounded-lg px-4 py-2 text-center text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all`}
        />
        <button 
          type="submit"
          className="bg-white/10 hover:bg-white/20 text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Login <ChevronRight size={14} />
        </button>
      </form>
      <div className="mt-12 text-center">
        <p className="text-6xl font-thin tracking-tighter mb-2">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        <p className="text-lg text-white/60 font-medium">
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

const NotificationSystem: React.FC<{ notifications: Notification[] }> = ({ notifications }) => (
  <div className="fixed top-12 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    {notifications.map(notif => (
      <div key={notif.id} className="bg-gray-900/90 backdrop-blur border border-white/10 p-4 rounded-lg shadow-2xl w-80 animate-in slide-in-from-right duration-300 pointer-events-auto flex gap-3 items-start">
        <div className="p-2 bg-blue-500/20 rounded-full text-blue-400 shrink-0">
          <Bell size={18} />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{notif.title}</h4>
          <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
          <span className="text-[10px] text-gray-500 mt-2 block">{notif.timestamp.toLocaleTimeString()}</span>
        </div>
      </div>
    ))}
  </div>
);

// --- Context Menu Component ---

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
  onChangeWallpaper: () => void;
  onOpenSettings: () => void;
  onLock: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onRefresh, onChangeWallpaper, onOpenSettings, onLock }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div 
      className="fixed z-[9999] w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1 text-sm text-gray-200 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={() => { onRefresh(); onClose(); }} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors">
        <RefreshCw size={14} /> Refresh
      </button>
      <div className="h-px bg-white/10 my-1 mx-2"></div>
      <button onClick={() => { onChangeWallpaper(); onClose(); }} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors">
        <ImageIcon size={14} /> Next Wallpaper
      </button>
      <button onClick={() => { onOpenSettings(); onClose(); }} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-colors">
        <Settings size={14} /> Personalize...
      </button>
      <div className="h-px bg-white/10 my-1 mx-2"></div>
      <button onClick={() => { onLock(); onClose(); }} className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white flex items-center gap-2 transition-colors text-gray-400">
        <Lock size={14} /> Lock Screen
      </button>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [locked, setLocked] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Unique Features State
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].url);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => {
      setBooted(true);
      // Wait for unlock to show welcome notification
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const addNotification = (title: string, message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, title, message, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleUnlock = () => {
    setLocked(false);
    addNotification("Welcome Back!", "System is ready. Connected to Wifi.");
  };

  const openApp = (id: AppId) => {
    setWindows(prev => {
      // Check if window exists
      const existing = prev.find(w => w.id === id);
      if (existing) {
        if (existing.isMinimized) {
           return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 } : w);
        }
        return prev;
      }
      
      const appConfig = APPS.find(a => a.id === id);
      
      // Calculate random position
      const initialWidth = appConfig?.defaultSize?.w || Math.min(window.innerWidth * 0.8, 1000);
      const initialHeight = appConfig?.defaultSize?.h || Math.min(window.innerHeight * 0.7, 700);
      const initialX = Math.max(20, (window.innerWidth - initialWidth) / 2 + (Math.random() * 40 - 20));
      const initialY = Math.max(40, (window.innerHeight - initialHeight) / 2 + (Math.random() * 40 - 20));

      return [...prev, {
        id,
        x: initialX,
        y: initialY,
        width: initialWidth,
        height: initialHeight,
        zIndex: zIndexCounter + 1,
        isMinimized: false,
        isMaximized: false
      }];
    });
    setZIndexCounter(c => c + 1);
    setActiveWindowId(id);
  };

  const closeWindow = (id: AppId) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const toggleMaximize = (id: AppId) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      
      if (w.isMaximized) {
        // Restore
        const rect = w.prevRect || { x: w.x, y: w.y, width: w.width, height: w.height };
        return { ...w, isMaximized: false, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      } else {
        // Maximize
        return { 
          ...w, 
          isMaximized: true, 
          prevRect: { x: w.x, y: w.y, width: w.width, height: w.height }
        };
      }
    }));
    // Also bring to front
    focusWindow(id);
  };

  const focusWindow = (id: AppId) => {
    setWindows(prev => {
      const w = prev.find(win => win.id === id);
      if (!w) return prev;
      if (w.zIndex === zIndexCounter && activeWindowId === id) return prev; 
      
      return prev.map(win => win.id === id ? { ...win, zIndex: zIndexCounter + 1 } : win);
    });
    setZIndexCounter(c => c + 1);
    setActiveWindowId(id);
  };

  const updateWindowState = (id: AppId, newState: Partial<WindowRect>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...newState } : w));
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, show: true });
    setShowSystemMenu(false);
  };

  const handleNextWallpaper = () => {
    const currentIndex = WALLPAPERS.findIndex(w => w.url === wallpaper);
    const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
    setWallpaper(WALLPAPERS[nextIndex].url);
  };

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const renderContent = (id: AppId) => {
    switch (id) {
      case 'home': return <HomeView />;
      case 'about': return <AboutView />;
      case 'experience': return <ExperienceView />;
      case 'projects': return <ProjectsView />;
      case 'skills': return <SkillsView />;
      case 'education': return <EducationView />;
      case 'certifications': return <CertificationsView />;
      case 'publications': return <PublicationsView />;
      case 'honors': return <HonorsView />;
      case 'contact': return <ContactView />;
      case 'settings': return <SettingsView currentWallpaper={wallpaper} onSetWallpaper={setWallpaper} />;
      case 'terminal': return <TerminalView />;
      case 'music': return <MusicPlayerView />;
      case 'calculator': return <CalculatorView />;
      default: return null;
    }
  };

  if (!booted) {
    return (
      <div 
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white cursor-wait"
        onClick={() => setBooted(true)} // Fail-safe click
      >
        <div className="mb-8 relative">
           <Monitor size={64} className="text-blue-500 animate-pulse" />
           <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
        </div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4 border border-gray-700">
           <div className="h-full bg-blue-500 transition-all duration-[2000ms] ease-out w-full" style={{ width: booted ? '100%' : '0%' }}></div>
        </div>
        <div className="text-sm font-mono text-blue-400">Initializing Sourish OS...</div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen bg-gray-900 bg-cover bg-center overflow-hidden flex flex-col relative select-none transition-all duration-700"
      style={{ backgroundImage: `url('${wallpaper}')` }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        if (contextMenu.show) setContextMenu({ ...contextMenu, show: false });
        if (showSystemMenu) setShowSystemMenu(false);
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      {/* Notifications */}
      <NotificationSystem notifications={notifications} />

      {/* Lock Screen Overlay */}
      {locked && <LockScreen onUnlock={handleUnlock} />}

      {/* Top Bar (Status Bar) */}
      <div className="h-8 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 text-white z-50 border-b border-white/5 relative shadow-sm">
        <div className="flex items-center space-x-4 text-xs font-semibold tracking-wide relative">
           <button 
             onClick={(e) => { e.stopPropagation(); setShowSystemMenu(!showSystemMenu); }}
             className={`hover:text-blue-400 cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${showSystemMenu ? 'bg-white/10' : ''}`}
            >
             <Terminal size={14} className="text-blue-400" /> Sourish OS
           </button>
           
           {/* System Dropdown Menu */}
           {showSystemMenu && (
             <div className="absolute top-9 left-0 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1 z-[9999] animate-in slide-in-from-top-2 duration-200">
               <button onClick={() => openApp('about')} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white text-gray-200 transition-colors">
                 About This OS
               </button>
               <div className="h-px bg-white/10 my-1 mx-2"></div>
               <button onClick={() => openApp('settings')} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white text-gray-200 transition-colors">
                 System Preferences...
               </button>
               <button onClick={() => setLocked(true)} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white text-gray-200 transition-colors">
                 Lock Screen
               </button>
               <div className="h-px bg-white/10 my-1 mx-2"></div>
               <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white text-gray-200 transition-colors">
                 Restart...
               </button>
               <button onClick={() => setBooted(false)} className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white text-gray-200 transition-colors">
                 Shut Down...
               </button>
             </div>
           )}

           <span className="opacity-20 hidden sm:inline">|</span>
           <span className="cursor-pointer hover:text-gray-300 hidden sm:inline">File</span>
           <span className="cursor-pointer hover:text-gray-300 hidden sm:inline">Edit</span>
           <span className="cursor-pointer hover:text-gray-300 hidden sm:inline">View</span>
           <span className="cursor-pointer hover:text-gray-300 hidden sm:inline">Window</span>
           <span className="cursor-pointer hover:text-gray-300 hidden sm:inline">Help</span>
        </div>
        <div className="flex items-center space-x-5 text-xs font-medium">
          <div className="flex items-center gap-2 text-green-400">
            <Wifi size={14} />
          </div>
          <div className="flex items-center gap-2">
             <Battery size={14} className="text-white" />
          </div>
          <Search size={14} className="cursor-pointer hover:text-blue-400 transition-colors" />
          <Clock />
        </div>
      </div>

      {/* Main Desktop Area */}
      <div className="flex-1 relative p-4 overflow-hidden" id="desktop-area">
        
        {/* Desktop Icons Grid */}
        <div key={refreshKey} className="grid grid-flow-col grid-rows-6 gap-6 justify-start content-start h-full p-2 w-fit animate-in fade-in duration-300">
          {APPS.map(app => (
            <button 
              key={app.id}
              onClick={() => openApp(app.id)}
              onContextMenu={(e) => e.stopPropagation()} 
              className="group flex flex-col items-center gap-2 w-24 p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:bg-white/20 active:bg-blue-500/30"
            >
              <div className={`${app.color} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {app.icon}
              </div>
              <span className="text-white text-xs font-medium text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-2 py-0.5 rounded-md bg-black/20 group-hover:bg-transparent">
                {app.title}
              </span>
            </button>
          ))}
        </div>

        {/* Windows */}
        {windows.map(win => {
          const appConfig = APPS.find(a => a.id === win.id);
          if (!appConfig) return null; // Safety check
          
          return (
            <Window 
              key={win.id}
              app={appConfig}
              state={win}
              isActive={activeWindowId === win.id}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={toggleMaximize}
              onFocus={focusWindow}
              onUpdateState={updateWindowState}
            >
              {renderContent(win.id)}
            </Window>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu({ ...contextMenu, show: false })}
          onRefresh={handleRefresh}
          onChangeWallpaper={handleNextWallpaper}
          onOpenSettings={() => openApp('settings')}
          onLock={() => setLocked(true)}
        />
      )}

      {/* Dock (Nav Panel) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[100] pointer-events-none">
        <div className="flex items-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-white/30 max-w-full overflow-x-auto no-scrollbar">
          {APPS.map((app) => {
            const isOpen = windows.some(w => w.id === app.id);
            const isMinimized = windows.find(w => w.id === app.id)?.isMinimized;
            const isActive = activeWindowId === app.id && !isMinimized;

            return (
              <div key={app.id} className="group relative flex flex-col items-center">
                {/* Tooltip */}
                <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/90 border border-white/20 text-white text-xs py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap shadow-lg backdrop-blur-sm -translate-y-2 group-hover:translate-y-0 duration-200 z-50">
                  {app.title}
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45"></div>
                </div>
                
                {/* Icon */}
                <button 
                  onClick={() => isOpen ? (isActive ? minimizeWindow(app.id) : focusWindow(app.id)) : openApp(app.id)}
                  className={`p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-110 flex-shrink-0
                    ${isOpen && !isMinimized ? 'bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'hover:bg-white/10'}
                  `}
                >
                  <div className={`${app.color} p-2.5 rounded-lg text-white shadow-lg`}>
                     {app.icon}
                  </div>
                </button>
                
                {/* Active Indicator */}
                <div className={`w-1.5 h-1.5 bg-white rounded-full mt-1.5 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;