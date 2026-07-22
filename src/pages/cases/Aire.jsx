import { Backlink, Section, Challenge, CaseNav } from '../../components/case/CaseParts'

export default function Aire() {
  return (
    <>
      <Backlink />
      <article className="case">
        <div className="case-head">
          <span className="logo-float logo-lg">
            <span className="aire-marks">
              <img className="nsf" src="/assets/logos/nsf.png" alt="National Science Foundation" />
              <img className="mc-swap-dark osc" src="/assets/logos/osc-logo.svg" alt="Ohio Supercomputer Center" />
            </span>
          </span>
          <span className="case-kicker">Research &amp; Internships · ML Research Intern · Ohio Supercomputer Center</span>
          <div className="case-status">
            <span className="st">AIRE &rsquo;25 &middot; OH-SCIPE</span>
          </div>
          <h1 className="case-title">Fake-image detection</h1>
          <p className="case-summary">In summer 2025 I was one of five students selected statewide for <b>AIRE</b> (AI Research Experience) &mdash; a National Science Foundation&ndash;funded research internship run by the <b>OH-SCIPE</b> project, a $5M NSF award across Case Western Reserve University, Ohio State, the University of Cincinnati, and the Ohio Supercomputer Center. Working with <b>Weicong Chen of Case Western Reserve University</b>, I used machine learning models to build a process that detects real and fake scientific images &mdash; with a focus on the part that&rsquo;s easy to get wrong: <em>evaluation and generalization</em>.</p>
          <p className="case-tags">Python · Computer vision · Machine learning · Out-of-distribution detection · Jupyter</p>
        </div>

        <div className="aire-cred">
          <img className="nsf" src="/assets/logos/nsf.png" alt="National Science Foundation" />
          <img className="mc-swap-dark osc" src="/assets/logos/osc-logo.svg" alt="Ohio Supercomputer Center" />
        </div>
        <p className="aire-cred-cap">Funded by the National Science Foundation through the SCIPE program · hosted with the Ohio Supercomputer Center</p>

        <Section num="01" title="The program">
          <p>AIRE is a competitive nine-week summer research program created under <b>OH-SCIPE</b>, a National Science Foundation SCIPE initiative (awards 2320952/2320953/2320954) to train research professionals in AI and machine learning across Ohio. Each selected student is assigned a real AI research project and paired with two mentors: a university researcher who guides the research itself, and a cyberinfrastructure professional who guides the computing side &mdash; high-performance computing systems and tools like Git, Conda, PyTorch, and Linux.</p>
          <p>My cohort&rsquo;s work &mdash; including this project &mdash; was covered in the <a href="https://www.osc.edu/press/aire_program_boosts_college_students_artificial_intelligence_skills" target="_blank" rel="noopener">Ohio Supercomputer Center&rsquo;s press release</a> on the program.</p>
        </Section>

        <Section num="02" title="Problem">
          <p>AI-generated and manipulated images are everywhere, and detectors for them have a quiet failure mode: a model that scores beautifully on its own test set often falls apart on images from a generator or dataset it has never encountered. The honest question isn&rsquo;t &ldquo;can it detect fakes here?&rdquo; &mdash; it&rsquo;s &ldquo;does it generalize?&rdquo;</p>
        </Section>

        <Section num="03" title="Idea">
          <p>Frame part of the problem as <b>out-of-distribution (OOD) detection</b>: rather than only learning &ldquo;fake vs real,&rdquo; score how far an image sits from the distribution of genuine images the model knows. And, just as importantly, judge the detector by how it behaves on <em>new</em> distributions &mdash; not on the data it trained on.</p>
        </Section>

        <Section num="04" title="Solution">
          <p>I built evaluation and testing pipelines around computer-vision models that ran detectors against datasets they weren&rsquo;t trained on, using OOD-detection techniques to measure separation. The pipeline made generalization the headline metric: feed in unseen data, look at how the scores distribute, and see whether real and generated inputs actually pull apart. Along the way I worked in Jupyter Notebooks and deepened my Python — on real research infrastructure, with a research mentor reviewing the work.</p>
        </Section>

        <Section num="05" title="Challenges & decisions">
          <Challenge n="01" q="Measuring generalization, not memorization">
            <p>The whole point was to avoid the trap of in-dataset accuracy. That meant cross-dataset evaluation by design &mdash; testing on distributions held out from training so the numbers reflect the real-world question.</p>
          </Challenge>
          <Challenge n="02" q="Reading score distributions, not just thresholds">
            <p>A single accuracy number hides a lot. Looking at the distribution of OOD scores shows <em>how</em> separable real and generated inputs are, which is far more informative when deciding whether a detector can be trusted on new data.</p>
          </Challenge>
        </Section>

        <Section num="06" title="Results">
          <p>The evaluation made the detector&rsquo;s behavior legible: how scores distribute across inputs on held-out data, where the separation is strong and where it blurs. That picture &mdash; not a single headline number &mdash; is what tells you whether a detector will hold up outside its training set.</p>
          <blockquote className="pullquote">
            <p>&ldquo;The internship gave me hands-on experience with real machine learning tools and workflows. If future applicants to the program are even slightly interested in AI, this is a great opportunity and fantastic way to learn and build something.&rdquo;</p>
            <p className="pull-src">&mdash; me, quoted in the <a href="https://www.osc.edu/press/aire_program_boosts_college_students_artificial_intelligence_skills" target="_blank" rel="noopener">OSC press release</a>, Sep 2025</p>
          </blockquote>
        </Section>

        <Section num="07" title="Lessons learned">
          <ul className="dot">
            <li>For detection work, the <em>evaluation</em> is the contribution &mdash; a model is only as good as the generalization you can actually demonstrate.</li>
            <li>Distribution shift is the real adversary; a detector that hasn&rsquo;t been tested off-distribution hasn&rsquo;t really been tested.</li>
            <li>Distributions tell a truer story than point metrics.</li>
            <li>Working alongside a research mentor and cyberinfrastructure professionals showed me how real research computing gets done &mdash; and that I can operate in that environment.</li>
          </ul>
        </Section>

        <CaseNav
          prev={{ to: '/projects/simple-rents', lbl: 'Previous', label: <>&larr; Simple Rents</> }}
          next={{ to: '/projects/minecraft', lbl: 'Next project', label: <>Minecraft servers &rarr;</> }}
        />
      </article>
    </>
  )
}
