const faqs = [
  {
    question: "Apa itu TerraPulse?",
    answer: "TerraPulse adalah platform edukasi dan aksi lingkungan yang mendorong gaya hidup berkelanjutan dan rendah emisi karbon."
  },
  {
    question: "Apa tujuan utama TerraPulse?",
    answer: "Meningkatkan kesadaran lingkungan dan mendorong aksi nyata untuk gaya hidup yang lebih berkelanjutan."
  },
  {
    question: "Untuk siapa TerraPulse dibuat?",
    answer: "Untuk semua orang, terutama generasi muda yang peduli lingkungan."
  },
  {
    question: "Mengapa gaya hidup berkelanjutan itu penting?",
    answer: "Karena membantu melindungi lingkungan dan menjaga sumber daya untuk masa depan."
  },
  {
    question: "Bagaimana cara menghubungi tim TerraPulse?",
    answer: "Melalui email atau kontak yang tersedia di halaman kontak."
  }
];

const faqButton = document.getElementById("faq-button");
const faqBox = document.getElementById("faq-box");
const faqContent = document.getElementById("faq-content");

faqButton.addEventListener("click", (e) => {
  e.stopPropagation(); 
  faqBox.classList.toggle("show");
});

faqs.forEach(faq => {
  const item = document.createElement("div");
  item.className = "faq-item";

  const question = document.createElement("div");
  question.className = "faq-question";
  question.innerHTML = `
    <span class="faq-text">${faq.question}</span>
    <i class="fa-solid fa-arrow-down faq-arrow"></i>
  `;

  const answer = document.createElement("div");
  answer.className = "faq-answer";
  answer.textContent = faq.answer;

  question.addEventListener("click", () => {
    const isOpen = answer.classList.contains("show");

    document.querySelectorAll(".faq-answer").forEach(a =>
      a.classList.remove("show")
    );

    document.querySelectorAll(".faq-arrow").forEach(arrow =>
      arrow.classList.remove("rotate")
    );

    if (!isOpen) {
      answer.classList.add("show");
      question.querySelector(".faq-arrow").classList.add("rotate");
    }
  });

  item.appendChild(question);
  item.appendChild(answer);
  faqContent.appendChild(item);
});

document.addEventListener("click", (e) => {
  if (!faqButton.contains(e.target) && !faqBox.contains(e.target)) {
    faqBox.classList.remove("show");
  }
});

window.addEventListener("scroll", () => {
  faqBox.classList.remove("show");
});