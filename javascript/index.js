const formEl = document.querySelector('form');
const successMsgEl = document.querySelector('.success-msg');
const textarea =  document.querySelector('textarea');
const inputEl = document.querySelectorAll('input');

const hasError = {
  fullname: false,
  email: false,
  subject: false,
  message: false
};

const formData = {};
const spans = {}

function createErrorSpan(input) {
  const span = document.createElement('span');
  span.className = "error-msg";
  span.dataset.testid = `test-contact-error-${input.name}`
  input.setAttribute('aria-describedby', span.dataset.testid)
  input.parentElement.insertAdjacentElement('afterend', span);
  return span;
}

function inputValidation(input, span) {
  const inputValue = input.value.trim();
  if (!inputValue) {
    span.textContent = `${input.name} is required`
    hasError[input.name] = true;
    return;
  }
    span.textContent = ""
    hasError[input.name] = false;
    switch (input.name) {
      case 'fullname':
        formData.fullname = input.value;
        break;
      case 'email':
        formData.email = input.value;
        break;
      case 'subject':
        formData.subject = input.value;
        break;
    }
};

inputEl.forEach(input => {
  spans[input.name] = createErrorSpan(input);
  input.title = `Please enter ${input.name}`
  input.addEventListener('input', () => {
    inputValidation(input, spans[input.name])
  })
})


function textareaValidation(span) {
  const value = textarea.value.trim();
  if (value.length < 10) {
    hasError.message = true;
    span.textContent = `${textarea.name} must be more than ten characters`;
  }else {
    span.textContent = ""
    formData.message = textarea.value;
    hasError.message = false;
  }
}

  spans.message = createErrorSpan(textarea);
 spans.message.classList.add('textarea-error')
  textarea.addEventListener('input', (e) => {
    textareaValidation(spans.message);
  });



successMsgEl.innerText = "";


formEl.addEventListener('submit', async function(e){
  e.preventDefault();

  inputEl.forEach(input => {
    inputValidation(input, spans[input.name]);
  })

    textareaValidation(spans.message);
  if (!Object.values(hasError).includes(true)) {
    document.querySelector('.submit-btn').innerText = 'Submitting...';
    document.querySelector('.submit-btn').style.opacity = 0.7;
    let successResponse = await sendFormData();
    if (successResponse) {
      document.querySelector('.submit-btn').innerText = 'Submit'
      document.querySelector('.submit-btn').style.opacity = 1;
      this.reset();
      successMsgEl.style.color = '';
      successMsgEl.innerText = "Form submitted successfully"
    }
  }
  })


document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target !== textarea) formEl.requestSubmit();
})


async function sendFormData() {
  try {
    const url = 'https://formspree.io/f/xqapyrbk'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error(`message failed to send due to error ${response.status}`);
    }
    let success = true;
    return success;
  } catch (error) {
    console.error(error);
    if (error.toString() === 'TypeError: Failed to fetch') {
      successMsgEl.innerText = 'Network failure. Please connect to the internet.';
      successMsgEl.style.color = 'red'
      return;
    }
    successMsgEl.innerText = error.toString();
    successMsgEl.style.color = 'red';
  }
}
