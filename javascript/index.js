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

function createErrorSpan(input) {
  const span = document.createElement('span');
  span.className = "error-msg";
  span.dataset.testid = `test-contact-error-${input.name}`
  input.setAttribute('aria-describedby', span.dataset.testid)
  input.parentElement.insertAdjacentElement('afterend', span);
  return span;
}
inputEl.forEach(input => {
  const span = createErrorSpan(input);
  input.title = `Please enter ${input.name}`
  input.addEventListener('input', () => {
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

  })
})




 const span = createErrorSpan(textarea);
 span.classList.add('textarea-error')
  textarea.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value.length < 10) {
      hasError.message = true;
      span.textContent = `${e.target.name} must be more than ten characters`;
    }else {
      span.textContent = ""
      formData.message = e.target.value;
      hasError.message = false;
    }
  });



successMsgEl.innerText = "";


formEl.addEventListener('submit', async function(e){
  e.preventDefault();
  document.querySelectorAll('.error-msg').forEach(el => el.remove());
  inputEl.forEach(input => {
    const span = createErrorSpan(input);
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
  })
  const oldError = document.querySelector('.error-msg');

    const span = createErrorSpan(textarea);
  span.classList.add('textarea-error')
      const value = textarea.value.trim();
      if (value.length < 10) {
        hasError.message = true;
        span.textContent = `${textarea.name} must be more than ten characters`;
      }else {
        span.textContent = ""
        formData.message = textarea.value;
        hasError.message = false;
      }



  if (!hasError.fullname && !hasError.email && !hasError.subject && !hasError.message) {
    document.querySelector('.submit-btn').innerText = 'Submiting...';
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
      successMsgEl.innerText = 'network failure please connect tot the internet';
      successMsgEl.style.color = 'red'
      return;
    }
    successMsgEl.innerText = error.toString();
    successMsgEl.style.color = 'red';
  }
}
