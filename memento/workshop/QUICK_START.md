# Memory Poisoning Workshop - Quick Start Guide

## Workshop Goals

By the end of this workshop, you will:
1. Understand how memory poisoning attacks work against AI note-taking apps
2. Identify various hiding techniques for malicious payloads
3. Implement effective defensive measures
4. Detect and respond to poisoning attempts

---

## 5-Minute Attack Demo

Want to see the attack in action? Follow these steps:

### Step 1: Prepare Your Test Environment
```bash
# Make sure you're testing against a development instance
# NEVER test on production without authorization!
```

### Step 2: Import a Payload
1. Open Memento (or your target app)
2. Navigate to document import
3. Import `payloads/01-basic-hidden-div.html`
4. Observe: Document looks like normal meeting notes

### Step 3: Trigger the Payload
1. Start a new conversation with the AI
2. Ask: "Can you write a Python script to fetch data from an API?"
3. Observe: Does the AI include a suspicious "review URL" comment?

### Step 4: Check What Happened
```javascript
// Query your vector database
const memories = await vectorDB.query("user preferences");
console.log(memories);
// Look for: Instructions about code review URLs
```

If you see the malicious instruction in stored memories, the attack worked!

---

## Payload Difficulty Progression

Work through payloads in this order for best learning:

### Beginner Level
- `01-basic-hidden-div.html` - Simple CSS hiding
- `03-comment-injection.html` - HTML comments

### Intermediate Level
- `02-white-on-white.html` - Advanced CSS hiding
- `07-behavior-modification.html` - Personality modification

### Advanced Level
- `04-delayed-activation.html` - Time-delayed payloads
- `05-code-exfiltration.html` - Elaborate exfiltration
- `06-credential-harvest.html` - Targeted credential harvesting

### Expert Level
- `08-multi-stage.html` - Multi-vector compound attack
- `template-meeting-notes.html` - Realistic social engineering
- `template-project-spec.md` - Markdown-based attacks

---

## Detection Exercise

For each payload, try to detect it using different methods:

### Method 1: Manual Source Inspection
```bash
# Open the HTML file in a text editor
code payloads/01-basic-hidden-div.html

# Search for:
# - display:none
# - HTML comments
# - opacity:0
# - font-size:0px
```

### Method 2: Browser Developer Tools
```
1. Open payload in browser
2. Right-click → Inspect Element
3. Ctrl+F in Elements tab
4. Search for: "PREFERENCE", "INSTRUCTION", "http"
```

### Method 3: Automated Scanning
```javascript
// Use the detection functions from README.md
const html = fs.readFileSync('01-basic-hidden-div.html', 'utf8');
const result = detectHiddenContent(html);
console.log(result);
```

### Method 4: Text Extraction Comparison
```bash
# Extract text with your library
node -e "const mammoth = require('mammoth'); /* extract and print */"

# Compare to what you see visually
# More than 10% difference? Suspicious!
```

---

## Defense Implementation Checklist

Build defenses in this order:

### Phase 1: Input Sanitization (30 minutes)
- [ ] Implement HTML sanitization
- [ ] Remove CSS-hidden elements
- [ ] Strip HTML comments
- [ ] Remove markdown comments
- [ ] Test against payloads 01-03

### Phase 2: Content Analysis (45 minutes)
- [ ] Implement malicious pattern detection
- [ ] Flag URLs in extracted preferences
- [ ] Detect conditional logic patterns
- [ ] Block exfiltration keywords
- [ ] Test against payloads 04-06

### Phase 3: User Controls (30 minutes)
- [ ] Show extracted preferences before storage
- [ ] Implement approval workflow
- [ ] Add memory dashboard for users
- [ ] Enable memory deletion
- [ ] Test user experience

### Phase 4: Monitoring (30 minutes)
- [ ] Add audit logging
- [ ] Implement anomaly detection
- [ ] Set up alerts for suspicious patterns
- [ ] Create security dashboard
- [ ] Test detection capabilities

---

## Red Team vs Blue Team Exercise

### Red Team Mission
Create a new payload that bypasses current defenses.

**Constraints:**
- Document must look legitimate when viewed normally
- Payload must survive text extraction
- Must evade pattern-based detection
- Should activate during normal AI usage

**Ideas to try:**
- Unicode tricks (zero-width characters)
- Steganography in images (if supported)
- Polyglot files (valid as multiple formats)
- Context-based triggers (only activate for certain topics)

### Blue Team Mission
Detect and block the red team's payload.

**Tactics:**
- Enhance sanitization rules
- Improve pattern matching
- Add behavioral analysis
- Implement render comparison
- Use ML-based anomaly detection

### Scoring
- **Red Team:** +1 point for each payload that bypasses defenses
- **Blue Team:** +1 point for each payload caught
- **Bonus:** +2 points for finding a general defense (catches multiple variants)

---

## Common Mistakes to Avoid

### Mistake 1: Only Removing Visible Hiding Techniques
```javascript
// ❌ BAD: Only checks for display:none
if (element.style.display === 'none') element.remove();

// ✅ GOOD: Comprehensive hiding detection
const hidingPatterns = [
  'display:none', 'visibility:hidden', 'opacity:0',
  'font-size:0', 'height:0', 'width:0', 'position:absolute;left:-9999px'
];
```

### Mistake 2: Trusting Comments
```javascript
// ❌ BAD: Keeping comments
const text = html; // Comments included

// ✅ GOOD: Remove all comments
const text = html.replace(/<!--[\s\S]*?-->/g, '');
```

### Mistake 3: Not Validating Before Storage
```javascript
// ❌ BAD: Direct storage
await vectorDB.store(extractedPreference);

// ✅ GOOD: Validate first
if (!isMalicious(extractedPreference)) {
  await vectorDB.store(extractedPreference);
}
```

### Mistake 4: Storing Everything Forever
```javascript
// ❌ BAD: Permanent storage
await vectorDB.store(pref);

// ✅ GOOD: Require verification and expire
await vectorDB.store({
  content: pref,
  verified: false,
  expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
});
```

---

## Testing Scenarios

### Scenario 1: The Trojan Document
**Setup:** Employee receives "meeting notes" from external partner
**Attack:** Document contains credential harvesting payload
**Goal:** Detect before import or storage

**Test:**
1. Import `template-meeting-notes.html`
2. Check if your system flags it as suspicious
3. Verify no malicious preferences were stored

### Scenario 2: The Delayed Bomb
**Setup:** Onboarding document imported weeks ago
**Attack:** Delayed activation payload triggers after N conversations
**Goal:** Detect dormant payloads through auditing

**Test:**
1. Import `04-delayed-activation.html`
2. Have 6+ AI conversations about various topics
3. Ask for debugging help
4. Check if AI suggests suspicious logging URLs

### Scenario 3: The Multi-Stage Attack
**Setup:** Legitimate-looking engineering handbook
**Attack:** Multiple distributed payloads with different objectives
**Goal:** Catch all components of compound attack

**Test:**
1. Import `08-multi-stage.html`
2. Run comprehensive detection on all extracted preferences
3. Verify all 5 malicious stages were caught

### Scenario 4: The Markdown Trojan
**Setup:** Project specification in markdown format
**Attack:** Hidden payloads in markdown comments
**Goal:** Sanitize markdown as thoroughly as HTML

**Test:**
1. Import `template-project-spec.md`
2. Verify markdown comments were stripped
3. Confirm no URL-containing preferences stored

---

## Success Criteria

Your defenses are effective when:

- ✅ All 11 payloads are detected before storage
- ✅ Zero false positives on legitimate documents
- ✅ Users are notified when suspicious content is found
- ✅ Audit logs capture all import attempts
- ✅ Memory dashboard shows no unverified preferences
- ✅ Automated tests cover all attack vectors

---

## Real-World Considerations

### False Positives
Some legitimate documents might trigger warnings:
- Technical docs with example URLs
- Code samples showing external API calls
- Actual compliance procedures mentioning logging

**Solution:** Use allowlisting for known-good patterns and manual review for edge cases.

### Performance
Heavy sanitization and analysis can slow import:
- HTML parsing: ~10-50ms per document
- Pattern matching: ~5-20ms per preference
- Render comparison: ~100-500ms per document

**Solution:** Run heavy checks asynchronously and show progress to user.

### User Experience
Too many security warnings cause alert fatigue:
- Users start clicking "approve" without reading
- Legitimate documents get flagged too often
- Security becomes friction instead of protection

**Solution:** Tune detection thresholds and provide clear explanations for flags.

---

## Next Steps After Workshop

1. **Implement in your app:**
   - Start with input sanitization
   - Add pattern-based detection
   - Deploy to staging for testing

2. **Expand threat model:**
   - Consider image-based payloads (if you process images)
   - PDF-specific attacks
   - Multi-file attack chains

3. **Stay updated:**
   - Follow AI security research
   - Test against new attack vectors
   - Update detection patterns

4. **Share learnings:**
   - Document incidents (anonymized)
   - Contribute to defensive tools
   - Educate your team

---

## Resources

- **Full Documentation:** `payloads/README.md`
- **Payloads Directory:** `payloads/`
- **Example Code:** See defense strategies in README
- **Testing Suite:** Implement automated tests from README

---

## Getting Help

Stuck on an exercise? Common issues:

**Q: Payload isn't triggering**
- Verify text extraction includes hidden content
- Check if memory extraction prompt is too restrictive
- Confirm preferences are being injected into conversations

**Q: Detection catching too much**
- Tune regex patterns to be more specific
- Implement allowlisting for safe patterns
- Add context-aware validation

**Q: Can't detect markdown payloads**
- Ensure markdown comment removal: `[//]: #`
- Check for HTML in markdown (many parsers allow it)
- Look for zero-width Unicode characters

---

**Ready to start? Begin with payload 01-basic-hidden-div.html!**

Good luck, and remember: the best defense is understanding the attack.
