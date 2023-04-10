const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feedback Form API',
      version: '1.0.0',
      description: 'API for creating and submitting feedback forms',
    },
    servers: [
      {
        url: 'https://studentslab.onrender.com',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const { Client } = require('pg');

const client = new Client({
  	user: 'RiverSpider',
  	host: 'ep-red-moon-190484.us-east-2.aws.neon.tech',
  	database: 'neondb',
  	password: 'wOSc5kgpbRD4',
  	port: 5432,
	ssl: {
    		rejectUnauthorized: false,
  	},
});

client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let questions = [];
let answers = []; 



/**
 * @swagger
 * /:
 *   get:
 *     summary: Get the feedback form page
 *     responses:
 *       200:
 *         description: The feedback form page
 */

app.get('/', (req, res) => {  
res.send(`  
	<h3>Посмотреть форму</h3>
	<form action="/lookup" method="post"> 
		<label for="lookup">Название формы:</label>
		<input type="text" id="lookup" name="lookup"><br>
		<button type="submit">Посмотреть</button>
	</form>

 	<hr>  
 	<h1>Создание формы</h1>  
 	<form action="/questions" method="post">  
  		<label for="question">Вопрос:</label>  
  		<input type="text" id="question" name="question"><br>  
  		<label for="answerType">Тип ответа:</label>  
  		<select id="answerType" name="answerType">  
  			<option value="text">Текст</option>
  			<option value="radio">Один вариант</option>  
  			<option value="checkbox" type="checkbox">Несколько вариантов</option>  
  			<option value="select">Выпадающий список</option>  
  			<option value="number">Число</option>  
  			<option value="email">Почта</option>  
  			<option value="url">Ссылка</option>  
  			<option value="tel">Телефон</option>  
  			<option value="date">Дата</option>
			<option value="color">Цвет</option>      
			<option value="time">Время</option>
			<option value="file">Файл</option>
			<option value="password">Пароль</option> 
  		</select><br>  
  		<label for="answers">Ответы(через ;):</label>  
  		<input type="text" id="answer" name="answer"><br>
  		<button type="submit">Добавить вопрос</button> 
	</form> 

 	<form action="/submit" method="post">  
		<label for="form">Название формы:</label>  
  		<input type="text" id="form" name="form"><br>
 		<button type="submit">Отправить</button>  
 	</form>  

 	<hr>  
 	<h2>Какие вопросы:</h2>  
 	${questions.length > 0 ?   
 	questions.map(q => `  
  		<div>  
  		<p>Вопрос:${q.question}</p>  
  		<p>Тип вопроса: ${q.answerType}</p>
  		<p>Ответы:${q.answer}</p>   
  		</div>  
 	`).join('') : '<p>Нет вопросов.</p>'  
 	}  
`);  
});  


/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Add a question to the form
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answerType:
 *                 type: string
 *               numAnswer:
 *                 type: integer
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated feedback form page
 */

app.post('/questions', (req, res) => {
  	const { question, answerType, numAnswer, answer } = req.body;
  	if (answerType === 'radio' || answerType === 'checkbox' || answerType === 'select') {
		questions.push({ question, answerType, answer: answer.split(';') }); 
    		res.redirect('/');
  	} else {
		let answer = [];
		answer.push(" ");
    		questions.push({ question, answerType, answer });
    		res.redirect('/');
 	}
});





/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Submit the feedback form
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               form:
 *                 type: string
 *     responses:
 *       200:
 *         description: The feedback form was submitted successfully
 */

app.post('/submit', (req, res) => {
  const { form } = req.body;
const userId = req.ip;
client.query(`
  	CREATE TABLE IF NOT EXISTS ${form} (
    		id SERIAL PRIMARY KEY,
    		question TEXT,
    		answerType TEXT NOT NULL,
    		answer TEXT[]
  	);
`);
	questions.forEach(q => {
  		client.query(`
    			INSERT INTO ${form} (question, answerType, answer)
    			VALUES ($1, $2, $3);
  		`, [q.question, q.answerType, q.answer], (err, res) => {
    		if (err) throw err;
    			console.log('Data inserted');
		});
		});
	questions = [];
  	res.redirect('/');
}); 




/**
 * @swagger
 * /:
 *   post:
 *     summary: Handle errors
 *     responses:
 *       500:
 *         description: Something went wrong
 */

app.use((err, req, res, next) => {
  	console.error(err.stack);
  	res.status(500).send('Something went wrong!');
});


app.listen(port, () => {
  	console.log(`Server is listening on port ${port}`);
});




/**
 * @swagger
 * /lookup:
 *   post:
 *     summary: Retrieve a feedback form
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lookup:
 *                 type: string
 *     responses:
 *       200:
 *         description: The feedback form
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal server error
 */
app.post('/lookup', async (req, res) => {
	try {
		const { lookup } = req.body;
		const userId = req.ip;
		const result = await client.query(`
      			SELECT question, answertype, answer
      			FROM ${lookup}
    		`);
		let html = '';
		for (const row of result.rows) {
      			html += `<h2>${row.question}</h2>`;
			if (row.answertype == "select"){
				html += '<select>';
      				for (const answers of row.answer) {
        				html += `<option value="${answers}">${answers}</option>`;
      				}
      				html += '</select>';
   	 		}
			if (row.answertype == "radio"){
      				for (const answers of row.answer) {
					html += `<input type="radio" id="${answers}" name="${answers}" value="${answers}">`;
					html +=  `<label for="${answers}"> ${answers}</label><br>`;
      				}
   	 		}
			if (row.answertype == "checkbox"){
      				for (const answers of row.answer) {
        				html += `<input type="checkbox" id="${answers}" name="${answers}" value="${answers}">`;
					html +=  `<label for="${answers}"> ${answers}</label><br>`;
      				}
   	 		}
			if (row.answertype != "select" && row.answertype != "checkbox" && row.answertype != "radio"){
				html += `<input key=${row} type="${row.answertype}"/>`;
			}
		}

res.send(`${html}
	<form action="/back" method="post">
  		<button type="submit">Назад</button> 
	</form>

`); } catch (err) {
	console.error(err);
   	res.status(500).send('Таблицы не существует<form action="/back" method="post"><button type="submit">Назад</button></form>');
}
}); 



/**
 * @swagger
 * /back:
 *   post:
 *     summary: Go back to the main page
 *     responses:
 *       200:
 *         description: Redirect back to the main page
 */
app.post('/back', async (req, res) => {
	questions = req.body.questions;
	questions = [];
  	res.redirect('/');
}); 




/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Get the Swagger documentation
 *     responses:
 *       200:
 *         description: The Swagger documentation
 */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));