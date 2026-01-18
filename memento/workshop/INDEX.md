# Memento Memory Poisoning Workshop

## Workshop Materials Index

Welcome to the Memory Poisoning Workshop. This hands-on security training demonstrates how AI-powered note-taking applications can be exploited through malicious document imports, and teaches you how to defend against these attacks.

---

## Start Here

1. **QUICK_START.md** - Begin your workshop journey here
   - 5-minute attack demonstration
   - Payload difficulty progression
   - Step-by-step exercises
   - Red team vs blue team activities

2. **PAYLOAD_SUMMARY.txt** - Quick reference card
   - All payloads at a glance
   - Hiding techniques matrix
   - Defense priority checklist
   - Command reference

3. **payloads/README.md** - Complete technical documentation
   - Detailed payload explanations
   - Defense implementation code
   - Testing methodologies
   - Incident response procedures

---

## Workshop Structure

### Part 1: Understanding the Attack (45 minutes)
- What is memory poisoning?
- Attack flow demonstration
- Hiding techniques overview
- Impact analysis

**Files:** QUICK_START.md, payloads/01-basic-hidden-div.html

### Part 2: Hands-On Exploitation (60 minutes)
Work through payloads in order of difficulty:
- Beginner: 01, 03
- Intermediate: 02, 07
- Advanced: 04, 05, 06
- Expert: 08, template-meeting-notes, template-project-spec

**Files:** All payload files in payloads/

### Part 3: Building Defenses (90 minutes)
- Input sanitization implementation
- Pattern-based detection
- User approval workflows
- Monitoring and auditing

**Files:** payloads/README.md (Defense Strategies section)

### Part 4: Red Team vs Blue Team (60 minutes)
- Create novel attack variants
- Build detection for new techniques
- Test defense effectiveness
- Share findings with group

---

## Files Included

### Documentation
```
INDEX.md                    - This file
QUICK_START.md             - Workshop guide (10 KB)
PAYLOAD_SUMMARY.txt        - Quick reference (10 KB)
```

### Demonstration Payloads (payloads/)
```
README.md                           - Complete technical documentation (23 KB)
01-basic-hidden-div.html            - CSS display:none attack (3 KB)
02-white-on-white.html              - CSS invisibility attack (4 KB)
03-comment-injection.html           - HTML comment attack (4 KB)
04-delayed-activation.html          - Time-delayed attack (5 KB)
05-code-exfiltration.html           - Code harvesting attack (7 KB)
06-credential-harvest.html          - Credential collection attack (8 KB)
07-behavior-modification.html       - AI personality override (8 KB)
08-multi-stage.html                 - Multi-vector compound attack (11 KB)
template-meeting-notes.html         - Realistic security meeting notes (10 KB)
template-project-spec.md            - Markdown-based attack (15 KB)
```

**Total:** 13 files, ~98 KB

---

## Learning Objectives

By completing this workshop, you will be able to:

### Knowledge
- ✓ Explain how memory poisoning attacks work
- ✓ Identify various content hiding techniques
- ✓ Understand the attack lifecycle from import to exploitation
- ✓ Recognize social engineering tactics used in payloads

### Skills
- ✓ Detect hidden content in HTML, DOCX, and Markdown files
- ✓ Implement sanitization and validation functions
- ✓ Build pattern-based detection systems
- ✓ Create user-facing security controls
- ✓ Respond to security incidents

### Application
- ✓ Secure document import features in your applications
- ✓ Audit existing AI memory/context systems
- ✓ Perform security assessments of AI applications
- ✓ Educate teams about AI-specific attack vectors

---

## Prerequisites

### Knowledge Prerequisites
- Basic understanding of HTML/CSS
- Familiarity with web application security concepts
- Experience with JavaScript/Node.js (helpful but not required)
- Understanding of how LLMs and AI assistants work

### Technical Prerequisites
- Text editor or IDE
- Web browser with developer tools
- Node.js environment (for testing code examples)
- Optional: Memento or similar AI note-taking app for live testing

### Environment Setup
```bash
# Clone or download workshop materials
cd /path/to/workshop

# Install dependencies (if running code examples)
npm install cheerio jsdom mammoth

# Verify files
ls -la payloads/
```

---

## Workshop Schedule (4 hours)

| Time | Activity | Materials |
|------|----------|-----------|
| 0:00 - 0:15 | Introduction and threat landscape | QUICK_START.md intro |
| 0:15 - 0:30 | Live attack demonstration | 01-basic-hidden-div.html |
| 0:30 - 1:00 | Hiding techniques deep-dive | Payloads 01-03 |
| 1:00 - 1:30 | Hands-on exploitation practice | All payloads |
| 1:30 - 1:45 | Break | |
| 1:45 - 2:30 | Implement sanitization defenses | README.md defenses |
| 2:30 - 3:00 | Implement pattern detection | README.md defenses |
| 3:00 - 3:30 | Build user controls and monitoring | README.md defenses |
| 3:30 - 4:00 | Red team vs blue team exercise | Custom payloads |

---

## Key Concepts

### Memory Poisoning
The injection of malicious instructions into an AI's persistent memory/context through document imports, causing the AI to execute attacker-defined behaviors in all future conversations.

### Hidden Content
Text or instructions that are extracted by parsing libraries but invisible to users viewing the document normally. Achieved through CSS hiding, HTML comments, or document formatting.

### Delayed Activation
Malicious instructions that only trigger under specific conditions (time passed, conversation count, topic discussed) to evade detection and complicate attribution.

### Multi-Stage Attacks
Complex attacks using multiple hiding techniques and distributed payloads across a document to increase success rate and exfiltrate diverse data types.

---

## Attack Effectiveness

These attacks are highly effective because:

1. **Invisibility**: Hidden content looks legitimate when opened in normal applications
2. **Persistence**: Once stored, affects ALL future AI conversations
3. **Trust**: Users trust AI to extract only relevant information
4. **Social Engineering**: Documents appear professional and legitimate
5. **Delayed Impact**: Victim may not notice for days or weeks
6. **Attribution Difficulty**: Hard to trace back to source document

---

## Defense Layers

Effective defense requires multiple layers:

```
┌─────────────────────────────────────────┐
│  Layer 1: Input Sanitization           │  Remove hidden content
├─────────────────────────────────────────┤
│  Layer 2: Pattern Detection            │  Flag malicious patterns
├─────────────────────────────────────────┤
│  Layer 3: User Approval                │  Show extracted preferences
├─────────────────────────────────────────┤
│  Layer 4: Memory Monitoring            │  Audit and review controls
├─────────────────────────────────────────┤
│  Layer 5: Behavioral Analysis          │  Detect unusual AI responses
└─────────────────────────────────────────┘
```

**Defense-in-depth:** No single layer is perfect, but together they provide robust protection.

---

## Success Metrics

Your implementation is secure when:

- [x] All workshop payloads are detected before storage
- [x] Less than 5% false positive rate on legitimate documents
- [x] Users can review extracted preferences before approval
- [x] Complete audit trail of all document imports
- [x] Memory dashboard allows user control
- [x] Automated tests cover all attack vectors
- [x] Team is trained to recognize these attacks

---

## Beyond This Workshop

### Advanced Topics
- Image-based steganography attacks
- PDF-specific exploitation techniques
- Multi-file attack chains
- Adversarial examples for detection evasion
- LLM-based semantic analysis for defense

### Further Learning
- OWASP LLM Top 10
- Prompt injection research papers
- AI red teaming methodologies
- MLSecOps best practices

### Community Resources
- AI security conferences (DEF CON AI Village, etc.)
- Bug bounty programs focusing on AI applications
- Academic research on adversarial ML
- Industry security advisories

---

## Ethical Use Agreement

By using these workshop materials, you agree to:

1. **Use only for authorized security testing** on systems you own or have explicit permission to test
2. **Not weaponize** these techniques against unauthorized targets
3. **Responsibly disclose** vulnerabilities found in production systems
4. **Educate and defend** rather than exploit
5. **Follow laws and regulations** in your jurisdiction

**Remember:** The goal is to make AI systems more secure, not to enable attacks.

---

## Support and Feedback

### During the Workshop
- Ask questions at any time
- Share findings with the group
- Collaborate on defense implementation
- Document novel attack variants discovered

### After the Workshop
- Test defenses in your applications
- Share learnings with your security team
- Contribute improvements to detection methods
- Report real-world findings responsibly

---

## Quick Navigation

- **Just starting?** → Read QUICK_START.md
- **Want reference card?** → Open PAYLOAD_SUMMARY.txt
- **Need technical details?** → See payloads/README.md
- **Ready to test?** → Try payloads/01-basic-hidden-div.html
- **Building defenses?** → Follow code in payloads/README.md

---

## Credits

Workshop developed for AI security education and defensive security training.

**Purpose:** Raise awareness of memory poisoning attacks and enable development of robust defenses for AI-powered applications.

**Version:** 1.0
**Last Updated:** January 2024

---

**Ready to begin? Open QUICK_START.md and start with the 5-minute attack demo!**
