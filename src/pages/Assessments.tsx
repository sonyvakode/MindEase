import { useState, useEffect } from "react";
import { GlassCard } from "../components/UI/GlassCard";
import { 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Printer, 
  Clock, 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  ChevronLeft, 
  ArrowRight,
  Shield,
  FileCheck2,
  Lock,
  UserCheck,
  X
} from "lucide-react";
import { api } from "../services/api";
import { AssessmentResult } from "../types";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../components/AuthProvider";

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen"
];

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or let yourself/family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const OPTIONS = [
  { text: "Not at all", score: 0 },
  { text: "Several days", score: 1 },
  { text: "More than half the days", score: 2 },
  { text: "Nearly every day", score: 3 }
];

export default function Assessments() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState<"GAD-7" | "PHQ-9" | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalSeverity, setFinalSeverity] = useState("");
  const [certificateCode, setCertificateCode] = useState("");

  // Certificate modal state
  const [selectedCertificate, setSelectedCertificate] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    loadQuizHistory();
  }, [user]);

  const loadQuizHistory = () => {
    if (user) {
      setLoadingHistory(true);
      api.getAssessments()
        .then(setHistory)
        .catch(err => console.error(err))
        .finally(() => setLoadingHistory(false));
    }
  };

  const startQuiz = (type: "GAD-7" | "PHQ-9") => {
    setActiveQuiz(type);
    setCurrentQuestionIndex(0);
    const questionsLength = type === "GAD-7" ? GAD7_QUESTIONS.length : PHQ9_QUESTIONS.length;
    setAnswers(new Array(questionsLength).fill(null));
    setIsCompleted(false);
    setSelectedCertificate(null);
  };

  const handleAnswerSelect = (score: number) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = score;
    setAnswers(updated);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    const questions = activeQuiz === "GAD-7" ? GAD7_QUESTIONS : PHQ9_QUESTIONS;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate and save result
      const total = answers.reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
      const severity = getSeverityLabel(activeQuiz!, total);
      // Cryptic-like certificate code
      const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
      const code = `ME-${activeQuiz?.replace("-", "")}-${randomId}`;

      setFinalScore(total);
      setFinalSeverity(severity);
      setCertificateCode(code);
      setIsCompleted(true);

      api.saveAssessment(activeQuiz!, total, severity, code)
        .then(() => loadQuizHistory())
        .catch((err) => console.error("Error saving assessment: ", err));
    }
  };

  const getSeverityLabel = (type: "GAD-7" | "PHQ-9", score: number): string => {
    if (type === "GAD-7") {
      if (score <= 4) return "Minimal Anxiety";
      if (score <= 9) return "Mild Anxiety";
      if (score <= 14) return "Moderate Anxiety";
      return "Severe Anxiety";
    } else {
      if (score <= 4) return "Minimal Depression";
      if (score <= 9) return "Mild Depression";
      if (score <= 14) return "Moderate Depression";
      if (score <= 19) return "Moderately Severe Depression";
      return "Severe Depression";
    }
  };

  const getInstructions = (type: "GAD-7" | "PHQ-9", score: number): string => {
    if (type === "GAD-7") {
      if (score <= 4) return "Your score suggests minimal anxiety symptoms. Maintain your active self-care and meditation rituals.";
      if (score <= 9) return "Your score suggests mild anxiety. We suggest exploring our breathing exercises and audio courses.";
      if (score <= 14) return "Your score suggests moderate anxiety patterns. It might be helpful to connect with one of our staff counsellors.";
      return "Your score suggests clinical level severe anxiety. We highly recommend booking an advisory consultation under the 'Apps' tab.";
    } else {
      if (score <= 4) return "Your score suggests minimal depressive symptoms. Continue practicing mindfulness daily.";
      if (score <= 9) return "Your score suggests mild depression levels. Daily therapeutic journaling and physical activity are proven to support state lifting.";
      if (score <= 14) return "Your score suggests moderate depression levels. Scheduling some time with our behavioral advisors can offer targeted coping plans.";
      if (score <= 19) return "Your score suggests moderately severe depression. Professional guidance from an empathetic therapist is strongly advised.";
      return "Your score suggests clinical level severe depression. Please prioritize arranging an urgent consultation with our clinicians.";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return "Today";
    if (ts.toDate && typeof ts.toDate === "function") {
      return ts.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const activeQuestions = activeQuiz === "GAD-7" ? GAD7_QUESTIONS : PHQ9_QUESTIONS;
  const progressPercent = activeQuiz ? Math.round((currentQuestionIndex / activeQuestions.length) * 100) : 0;

  return (
    <div id="assessments-root" className="space-y-8 pb-12">
      {/* Printable Style Sheet specifically for printing certificates cleanly */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            background: white !important;
            color: black !important;
            padding: 30px !important;
            border: 15px double #022c22 !important;
            border-radius: 0px !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {!activeQuiz ? (
        <>
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Clinical Assessments</h1>
            <p className="text-white/40 text-sm font-medium mt-1">
              Scientifically certified self-assessment quizzes with professional printable completion certificates.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GAD-7 Card */}
            <GlassCard className="p-8 flex flex-col justify-between group hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-white group-hover:scale-110 transition-transform">
                <Shield className="w-40 h-40" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
                  Clinical Anxiety Screening
                </div>
                <h2 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">GAD-7 Scale</h2>
                <p className="text-sm text-white/40 font-medium leading-relaxed mb-6">
                  The Generalized Anxiety Disorder 7-item scale is a proven clinical diagnostic instrument used globally to screen for, evaluate severity of, and track typical symptoms of generalized anxiety.
                </p>
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/30 uppercase tracking-[0.1em] mb-8">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 3-5 Mins</span>
                  <span>•</span>
                  <span>7 Clinical Inquiries</span>
                  <span>•</span>
                  <span>Verified Outcome</span>
                </div>
              </div>
              <button 
                onClick={() => startQuiz("GAD-7")}
                className="w-full bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/5 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 group-hover:bg-white/10"
              >
                Launch GAD-7 Screener <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>

            {/* PHQ-9 Card */}
            <GlassCard className="p-8 flex flex-col justify-between group hover:border-violet-500/20 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-white group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-40 h-40" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#c084fc] uppercase tracking-[0.2em] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_5px_#a78bfa]" />
                  Depressive Symptom Screener
                </div>
                <h2 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-[#c084fc] transition-colors">PHQ-9 Scale</h2>
                <p className="text-sm text-white/40 font-medium leading-relaxed mb-6">
                  The Patient Health Questionnaire 9-item scale is an internationally validated clinical diagnostic resource for measuring depressive symptoms, mood regulation indices, and overall level of emotional vitality.
                </p>
                <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/30 uppercase tracking-[0.1em] mb-8">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 4-6 Mins</span>
                  <span>•</span>
                  <span>9 Diagnostic Inquiries</span>
                  <span>•</span>
                  <span>Verified Outcome</span>
                </div>
              </div>
              <button 
                onClick={() => startQuiz("PHQ-9")}
                className="w-full bg-white/5 hover:bg-violet-600 hover:text-white border border-white/5 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 group-hover:bg-white/10"
              >
                Launch PHQ-9 Screener <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>
          </div>

          {/* Past Certifications */}
          <GlassCard className="p-8 mt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Your Screening Certificates</h3>
                <p className="text-white/40 text-xs font-medium mt-0.5">Secure, verifiable records of your self-reflection journey.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {loadingHistory ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-white/30 uppercase tracking-widest font-bold">
                      <th className="py-4 px-2">Quiz Model</th>
                      <th className="py-4 px-2">Score / Scale</th>
                      <th className="py-4 px-2">Symptom Severity</th>
                      <th className="py-4 px-2">Certificate ID</th>
                      <th className="py-4 px-2">Date Cleared</th>
                      <th className="py-4 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium text-white/80">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-2">
                          <span className="font-bold text-sm text-white">{record.quizType}</span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-xs font-mono font-bold text-white/50 bg-white/5 py-1 px-2.5 rounded-lg border border-white/5">
                            {record.score} / {record.quizType === "GAD-7" ? 21 : 27}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className={cn(
                            "py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            record.severity.includes("Minimal") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            record.severity.includes("Mild") ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                            "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          )}>
                            {record.severity}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono text-white/40 uppercase tracking-wide">
                          {record.certificateId}
                        </td>
                        <td className="py-4 px-2 text-white/50">
                          {formatTimestamp(record.timestamp)}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button 
                            onClick={() => setSelectedCertificate(record)}
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer border border-emerald-500/20 hover:border-transparent scale-95 group-hover:scale-100"
                          >
                            View Certificate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/5 rounded-3xl text-center">
                <Lock className="w-10 h-10 text-white/10 mb-4" />
                <p className="text-sm font-semibold text-white/40">No assessments completed yet.</p>
                <p className="text-xs text-white/20 mt-1 max-w-sm">Complete any quiz above to unlock your certified diagnostic record.</p>
              </div>
            )}
          </GlassCard>
        </>
      ) : (
        /* ACTIVE SCREENER LAYOUT */
        <div className="max-w-2xl mx-auto py-4">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key="screener-questions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                {/* Header with back controls */}
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => setActiveQuiz(null)}
                    className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Exit Test
                  </button>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.25em] bg-emerald-500/5 border border-emerald-500/10 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                    {activeQuiz} Screening
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-white/30 tracking-widest">
                    <span>Inquiry {currentQuestionIndex + 1} of {activeQuestions.length}</span>
                    <span>{progressPercent}% Done</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full purple-gradient transition-all duration-300" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question and choices card */}
                <GlassCard className="p-8 sm:p-10 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Over the last 2 weeks, how often have you been bothered by:</p>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                      {activeQuestions[currentQuestionIndex]}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {OPTIONS.map((opt, i) => {
                      const isSelected = answers[currentQuestionIndex] === opt.score;
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswerSelect(opt.score)}
                          className={cn(
                            "w-full border rounded-2xl py-4.5 px-6 text-left transition-all duration-300 cursor-pointer flex items-center justify-between group/btn text-sm font-semibold active:scale-98",
                            isSelected 
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                              : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                          )}
                        >
                          <span className={cn(
                            "transition-colors",
                            isSelected ? "text-emerald-400 font-bold" : "text-white/80 group-hover/btn:text-white"
                          )}>{opt.text}</span>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[10px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/5 animate-none",
                              isSelected ? "text-emerald-400/80 border-emerald-500/20 bg-emerald-500/5" : "text-white/20"
                            )}>
                              +{opt.score} pt
                            </span>
                            <div className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center bg-black/10 transition-all",
                              isSelected ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 group-hover/btn:border-emerald-500/50 hover:bg-white/5"
                            )}>
                              <span className={cn(
                                "w-2 h-2 rounded-full bg-emerald-500 transition-all",
                                isSelected ? "scale-100 shadow-[0_0_8px_#10B981]" : "scale-0"
                              )} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation controls */}
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                    <button 
                      onClick={handleBack}
                      disabled={currentQuestionIndex === 0}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer py-2.5 px-4 rounded-xl",
                        currentQuestionIndex > 0
                          ? "text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                          : "text-white/10 bg-transparent cursor-not-allowed opacity-30"
                      )}
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <button 
                      onClick={handleNext}
                      disabled={answers[currentQuestionIndex] === null}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all py-2.5 px-5 rounded-xl",
                        answers[currentQuestionIndex] !== null
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-lg shadow-emerald-500/10"
                          : "bg-white/5 text-white/20 cursor-not-allowed"
                      )}
                    >
                      {currentQuestionIndex === activeQuestions.length - 1 ? (
                        <>Submit <CheckCircle2 className="w-4 h-4" /></>
                      ) : (
                        <>Next Question <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              /* RESULTS SHEET DESIGN */
              <motion.div
                key="completed-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <GlassCard className="p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 purple-gradient" />
                  
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-stone-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Diagnostic Screener Complete</p>
                    <h2 className="text-3xl font-extrabold tracking-tight">Your {activeQuiz} Assessment Outcome</h2>
                  </div>

                  {/* Score circle */}
                  <div className="w-40 h-40 rounded-full border border-white/10 flex flex-col items-center justify-center mx-auto bg-white/5 space-y-1 py-4">
                    <span className="text-[10px] uppercase font-bold text-white/30 tracking-[0.15em]">Your Score</span>
                    <span className="text-5xl font-black text-white leading-none font-mono">
                      {finalScore}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-white/30 tracking-[0.1em]">
                      Max Scale: {activeQuiz === "GAD-7" ? 21 : 27}
                    </span>
                  </div>

                  <div className="space-y-3 max-w-lg mx-auto">
                    <div className="inline-block py-1 px-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-xs tracking-wider">
                      {finalSeverity}
                    </div>
                    <p className="text-xs sm:text-sm text-white/60 font-medium leading-relaxed">
                      {getInstructions(activeQuiz!, finalScore)}
                    </p>
                  </div>

                  {/* PDF Certificate card promotion */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-left gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Mindfulness & Self-Reflection Record Generated</h4>
                          <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider mt-0.5">Code: {certificateCode}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedCertificate({
                          userId: user?.uid || "",
                          quizType: activeQuiz!,
                          score: finalScore,
                          severity: finalSeverity,
                          certificateId: certificateCode,
                          timestamp: new Date()
                        })}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                      >
                        View Official Certificate
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button 
                        onClick={() => startQuiz(activeQuiz!)}
                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer text-white/60"
                      >
                        Retake Test
                      </button>
                      <button 
                        onClick={() => setActiveQuiz(null)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        Go Back to Main
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* DETAILED PRINTABLE CERTIFICATE MODAL SCREEN */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto no-print"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="max-w-2xl w-full bg-[#050e0f] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative"
            >
              {/* Header inside modal */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50">
                  <Award className="w-4 h-4 text-emerald-400" /> Verifiable screening document
                </div>
                <button 
                  onClick={() => setSelectedCertificate(null)}
                  className="bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded-full p-2 transition-all cursor-pointer border border-white/10 hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="Close Certificate"
                  id="close-cert-top-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PRINT AREA OF THE CERTIFICATE */}
              <div 
                id="print-area" 
                className="bg-[#040a0b] border-4 border-emerald-950 p-8 sm:p-12 rounded-2xl relative overflow-hidden"
                style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.02) 0%, rgba(0,0,0,0) 80%)" }}
              >
                {/* Vintage/Double Elegant Border */}
                <div className="absolute inset-2 border border-emerald-950/40 pointer-events-none rounded-lg" />
                <div className="absolute inset-4 border-2 border-dashed border-emerald-900/20 pointer-events-none rounded-lg" />

                {/* Star Stamp Watermark Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none select-none text-white">
                  <Shield className="w-96 h-96" />
                </div>

                <div className="text-center space-y-8 relative z-10 text-white">
                  {/* Crest Logo */}
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-stone-600 shadow-xl">
                    <UserCheck className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em] font-sans">Official Record</h2>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase font-sans text-white border-b-2 border-emerald-500/10 pb-4 max-w-sm mx-auto">
                      Certificate <span className="text-emerald-400">of Completion</span>
                    </h1>
                  </div>

                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.25em] italic">This clinical screening note confirms that</p>

                  <div className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-white border-b border-white/5 pb-2 inline-block px-10">
                      {user?.displayName || "Patient Member"}
                    </p>
                    <p className="text-[8px] sm:text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] pt-1">Registered MindEase Health Account</p>
                  </div>

                  <div className="max-w-md mx-auto text-xs text-white/60 tracking-wide leading-relaxed font-sans font-medium">
                    has voluntarily underwent and completed the clinic grade self-assessment screening under the <strong className="text-emerald-400 uppercase">{selectedCertificate.quizType}</strong> diagnostics program on <strong className="text-white">{formatTimestamp(selectedCertificate.timestamp)}</strong>.
                  </div>

                  {/* Summary Stats Table */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto border border-white/5 bg-white/[0.01] rounded-2xl p-4 mt-2">
                    <div className="border-r border-white/5 text-center">
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Diagnostic Score</p>
                      <p className="text-xl font-bold font-mono text-white">
                        {selectedCertificate.score} <span className="text-white/30 text-xs">/ {selectedCertificate.quizType === "GAD-7" ? 21 : 27}</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Symptom Severity</p>
                      <p className="text-xs font-bold text-emerald-400 truncate">
                        {selectedCertificate.severity}
                      </p>
                    </div>
                  </div>

                  {/* QR / Stamp / Serial numbers and Signature lines of the clinician */}
                  <div className="grid grid-cols-2 gap-8 items-end pt-6 border-t border-white/5 max-w-lg mx-auto">
                    {/* Authenticity Identifier */}
                    <div className="text-left space-y-1.5 font-mono text-[9px] text-white/40">
                      <p className="font-sans font-bold uppercase text-[7px] text-white/20 tracking-widest">Document Credentials</p>
                      <p className="uppercase text-emerald-500/70">REF: {selectedCertificate.certificateId}</p>
                      <p className="text-white/20">VERIFIED SYSTEM RECORD: SECURE-ID</p>
                    </div>

                    {/* Digital Counselor Signature */}
                    <div className="text-right space-y-1">
                      <p className="font-sans italic text-white/80 font-bold font-serif text-sm tracking-wide">Dr. Ananya Sharma</p>
                      <div className="w-32 h-0.5 bg-emerald-500/20 ml-auto" />
                      <p className="font-sans font-bold uppercase text-[7px] text-white/30 tracking-widest">Consultant Clinical Director</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer controls for printing */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Printer className="w-4 h-4" /> Print or Export PDF
                </button>
                <button 
                  onClick={() => setSelectedCertificate(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer text-center flex items-center justify-center gap-2 border border-white/5"
                  id="close-cert-footer-btn"
                >
                  <X className="w-4 h-4" /> Close Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
