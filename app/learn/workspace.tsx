'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { appliedStages, modules } from '../curriculum';
import { moduleGuides } from '../lesson-guides';

const flatLessons = modules.flatMap((module) => module.lessons.map((lesson) => ({ module, lesson })));

export default function LearnWorkspace({ initialLessonId }: { initialLessonId?: string }) {
  const initialIndex = Math.max(0, flatLessons.findIndex(({ lesson }) => lesson.id === initialLessonId));
  const [index, setIndex] = useState(initialIndex);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [answer, setAnswer] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const current = flatLessons[index];
  const guide = moduleGuides[current.module.id];
  const lessonInModule = current.module.lessons.findIndex((item) => item.id === current.lesson.id) + 1;
  const moduleCompleted = current.module.lessons.filter((item) => completed.has(item.id)).length;
  const moduleDone = moduleCompleted === current.module.lessons.length;
  const percent = Math.round((completed.size / flatLessons.length) * 100);

  useEffect(() => { fetch('/api/progress').then((response) => response.ok ? response.json() : { completed: [] }).then((data) => setCompleted(new Set(data.completed ?? []))); }, []);
  useEffect(() => { setAnswer(null); setSaveError(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [index]);

  async function completeLesson() {
    const id = current.lesson.id;
    if (completed.has(id)) return;
    setSaving(true); setSaveError('');
    const next = new Set(completed); next.add(id); setCompleted(next);
    const response = await fetch('/api/progress', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lessonId: id, completed: true }) });
    if (!response.ok) { setCompleted(completed); setSaveError('Progress could not be saved. Check your Supabase table setup.'); }
    setSaving(false);
  }

  function selectLesson(id: string) { const next = flatLessons.findIndex((item) => item.lesson.id === id); if (next >= 0) setIndex(next); }

  return <main className="learn-shell learn-shell-premium">
    <aside className="learn-sidebar premium-sidebar">
      <div className="sidebar-course-label"><span>Machine learning</span><b>Zero to deployed</b></div>
      <div className="learn-progress premium-progress"><div className="progress-copy"><span>Overall progress</span><strong>{percent}%</strong></div><div><i style={{ width: `${percent}%` }} /></div><small>{completed.size} of {flatLessons.length} lessons completed</small></div>
      <div className="module-nav-label">Course roadmap <span>10 modules</span></div>
      {modules.map((module) => { const done = module.lessons.filter((item) => completed.has(item.id)).length; return <details key={module.id} open={module.id === current.module.id} className={module.id === current.module.id ? 'current-module' : ''}>
        <summary><span>{module.number}</span><div>{module.title}<small>{module.subtitle}</small></div><b>{done}/{module.lessons.length}</b></summary>
        <ul>{module.lessons.map((lesson, lessonIndex) => <li key={lesson.id}><button className={lesson.id === current.lesson.id ? 'active' : ''} onClick={() => selectLesson(lesson.id)}><i className={completed.has(lesson.id) ? 'done' : ''}>{completed.has(lesson.id) ? '✓' : lessonIndex + 1}</i><span>{lesson.title}<small>{lesson.minutes} min</small></span></button></li>)}</ul>
      </details>; })}
    </aside>

    <article className="learn-reader premium-reader">
      <section className="applied-track">
        <div className="applied-track-heading"><div><span className="kicker">Applied ML career track</span><h2>Build one system in 12 stages</h2></div><p>Learn → practise → ship</p></div>
        <div className="stage-rail">{appliedStages.map((stage) => <button key={stage.number} className={`${stage.lessonId === current.lesson.id ? 'active' : ''} ${completed.has(stage.lessonId) ? 'done' : ''}`} onClick={() => selectLesson(stage.lessonId)}><span>{completed.has(stage.lessonId) ? '✓' : stage.number}</span><div><b>{stage.title}</b><small>{stage.outcome}</small></div></button>)}</div>
      </section>
      <header className={`lesson-hero ${current.module.color}`}>
        <div className="lesson-hero-top"><span>Module {current.module.number}</span><span>Lesson {lessonInModule} of {current.module.lessons.length}</span></div><div className="lesson-symbol" aria-hidden="true">{current.module.symbol}</div><p>{current.module.title}</p><h1>{current.lesson.title}</h1>
        <div className="lesson-meta-row"><span>◷ {current.lesson.minutes} minutes</span><span>◎ Beginner friendly</span><span>✦ Knowledge check</span></div><div className="module-mini-progress"><i style={{ width: `${Math.round(moduleCompleted / current.module.lessons.length * 100)}%` }} /></div>
      </header>

      <div className="lesson-content">
        <section id="concept" className="lesson-intro"><span className="section-number">01</span><div><span className="kicker">Core concept</span><h2>Build the mental model</h2><p className="reader-lead">{current.lesson.explanation}</p><div className="why-it-matters"><b>Why this matters</b><p>{guide.why}</p></div><div className="key-ideas"><h3>What you must understand</h3>{guide.keyIdeas.map((idea, ideaIndex) => <article key={idea}><span>{String(ideaIndex + 1).padStart(2, '0')}</span><p>{idea}</p></article>)}</div></div></section>
        <section className="mentor-note mentor-card"><div className="mentor-avatar">M</div><div><b>Your mentor says</b><p>Do not memorise the syntax. First explain what problem this tool solves, then run the example and change one input to observe what changes.</p></div></section>
        <section id="steps" className="reader-section structured-section"><span className="section-number">02</span><div><span className="kicker">Learning method</span><h2>Understand it in four moves</h2><div className="learning-steps"><article><b>1</b><h3>Inspect</h3><p>Identify the input, its shape and its data type.</p></article><article><b>2</b><h3>Apply</h3><p>Use the concept on a small example you can inspect.</p></article><article><b>3</b><h3>Verify</h3><p>Check the output before adding it to a larger pipeline.</p></article><article><b>4</b><h3>Explain</h3><p>Describe the result in plain language without jargon.</p></article></div></div></section>
        <section id="example" className="reader-section structured-section example-section"><span className="section-number">03</span><div><span className="kicker">Worked example</span><h2>Try the pattern</h2><div className="code-window"><div className="code-toolbar"><span><i></i><i></i><i></i></span><b>practice.py</b><em>Python</em></div><pre><code>{current.lesson.example}</code></pre></div><div className="experiment-prompt"><span>↗</span><p><b>Your turn:</b> Change one value, predict the output, then run it. Write down why the result changed.</p></div></div></section>
        <section id="lab" className="reader-section structured-section full-lab"><span className="section-number">04</span><div><span className="kicker">Complete runnable example</span><h2>Build the full workflow</h2><p className="section-lead">This longer example connects the lesson to a realistic project. Copy it into a notebook, run each block, and inspect every output.</p><div className="code-window large-code"><div className="code-toolbar"><span><i></i><i></i><i></i></span><b>{current.module.id}_lab.py</b><em>Complete example</em></div><pre><code>{guide.fullExample}</code></pre></div><div className="code-walkthrough"><h3>Read the code in this order</h3>{guide.walkthrough.map((step, stepIndex) => <article key={step}><b>{stepIndex + 1}</b><p>{step}</p></article>)}</div></div></section>
        <section id="pitfalls" className="reader-section structured-section pitfalls-section"><span className="section-number">05</span><div><span className="kicker">Common mistakes</span><h2>Know what usually goes wrong</h2><div className="pitfall-grid">{guide.mistakes.map((mistake) => <article key={mistake}><span>!</span><p>{mistake}</p></article>)}</div></div></section>
        <section id="practice" className="reader-section structured-section practice-ladder"><span className="section-number">06</span><div><span className="kicker">Practice ladder</span><h2>Turn the idea into a skill</h2><div className="practice-levels">{guide.practice.map((item, itemIndex) => <article key={item.level}><div><span>Level {itemIndex + 1}</span><b>{item.level}</b></div><h3>{item.title}</h3><p>{item.task}</p><label><input type="checkbox" /> I completed this challenge</label></article>)}</div></div></section>
        <section id="check" className="reader-section structured-section"><span className="section-number">07</span><div className="practice-box premium-practice"><div className="practice-heading"><div><span className="kicker">Knowledge check</span><h2>{current.lesson.exercise.question}</h2></div><span className="question-pill">1 question</span></div><div className="reader-choices">{current.lesson.exercise.choices.map((choice, choiceIndex) => <button key={choice} className={answer === choiceIndex ? (choiceIndex === current.lesson.exercise.answer ? 'correct' : 'wrong') : ''} onClick={() => setAnswer(choiceIndex)}><span>{String.fromCharCode(65 + choiceIndex)}</span><b>{choice}</b><i>{answer === choiceIndex ? (choiceIndex === current.lesson.exercise.answer ? '✓' : '×') : '→'}</i></button>)}</div>{answer !== null && <div className={answer === current.lesson.exercise.answer ? 'result correct' : 'result wrong'}><b>{answer === current.lesson.exercise.answer ? 'Excellent — you got it.' : 'Not quite — try once more.'}</b><p>{current.lesson.exercise.feedback}</p></div>}</div></section>
        <details id="interview" className="interview-bite premium-interview"><summary><span>Interview bite</span><div><b>Explain it like a practitioner</b><small>Reveal a concise answer you can reuse</small></div><i>+</i></summary><div><h3>{current.lesson.interview.question}</h3><p>{current.lesson.interview.answer}</p></div></details>
        {moduleDone && <section className="task-unlocked"><span>✓ Module complete</span><h2>Your practical task is unlocked.</h2><p>Use the concepts together before moving on. This is where knowledge becomes skill.</p><Link href={`/tasks#${current.module.id}`}>Open practical task →</Link></section>}
        {saveError && <p className="progress-save-error">{saveError}</p>}
        <footer className="reader-actions premium-actions"><button disabled={index === 0} onClick={() => setIndex(index - 1)}><small>Previous lesson</small><b>← {index > 0 ? flatLessons[index - 1].lesson.title : 'Start'}</b></button><button className={completed.has(current.lesson.id) ? 'lesson-done' : ''} disabled={saving} onClick={completeLesson}>{saving ? 'Saving…' : completed.has(current.lesson.id) ? '✓ Lesson completed' : 'Mark lesson complete'}</button><button disabled={index === flatLessons.length - 1} onClick={() => setIndex(index + 1)}><small>Next lesson</small><b>{index < flatLessons.length - 1 ? flatLessons[index + 1].lesson.title : 'Finished'} →</b></button></footer>
      </div>
    </article>

    <aside className="learn-outline premium-outline"><span className="kicker">Lesson map</span><a href="#concept"><i>01</i><span>Core concept</span></a><a href="#steps"><i>02</i><span>Learning method</span></a><a href="#example"><i>03</i><span>Quick example</span></a><a href="#lab"><i>04</i><span>Complete code lab</span></a><a href="#pitfalls"><i>05</i><span>Common mistakes</span></a><a href="#practice"><i>06</i><span>Practice ladder</span></a><a href="#check"><i>07</i><span>Knowledge check</span></a><a href="#interview"><i>08</i><span>Interview bite</span></a><div className="lesson-goal"><span>Today’s goal</span><strong>Understand, apply and explain this concept.</strong></div><div className="time-card"><strong>{current.lesson.minutes + 25} min</strong><small>Lesson + hands-on lab</small></div></aside>
  </main>;
}
