const http = require("http");
const Koa = require("koa");
const cors = require('@koa/cors');
const koaBody = require('koa-body').default;
const uuid = require("uuid");

const app = new Koa();
let Tasks = {};
const port = 1022;

app.use(
	koaBody({
		urlencoded: true,
		multipart: true,
	})
);

app.use(cors());

// REST permission
app.use((ctx, next) => {
	if (ctx.request.method !== 'OPTIONS') {
		next();
		return
	}
	cors();
	ctx.response.set("Access-Control-Allow-Origin", "*"); 
	ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST'); 
	ctx.response.status = 204;
	ctx.response.body = 'server response';
	next();
});


// add ticket
app.use((ctx, next) => {
	cors();


	if (ctx.request.method === 'POST') {
		const Task = ctx.request.body;
		Task.status = false;
		const id = uuid.v4();
		Task.id = id
		Tasks[id] = Task;
		console.log(Tasks);
		console.log(ctx.request.body);

		ctx.response.body = Task;


		next();
	} else {
		next();
		return
	}


});

// delete
app.use((ctx, next) => {
	cors();
	if (ctx.request.method === 'DELETE') {

		console.log(ctx.request.header.req);

		const id = ctx.request.header.req;

		delete Tasks[id];


		console.log(Tasks);
		ctx.response.status = 200;

		ctx.response.body = "Ticket is deleted";
		next();
	} else {
		next();
		return
	}
});

// checkbox
app.use((ctx, next) => {
	cors();
	ctx.response.set("Access-Control-Allow-Origin", "*");
	if (ctx.request.method === 'PATCH') {

		console.log(ctx.request.body);

		const checked = ctx.request.body;
		const id = checked.id;
		Tasks[id].status = checked.status;

		console.log(Tasks[id]);

		ctx.response.body = "Ticket is checked";
		next();
	} else {
		next();
		return
	}
});

// edit info
app.use((ctx, next) => {
	cors();
	ctx.response.set("Access-Control-Allow-Origin", "*");
	if (ctx.request.method === 'PUT') {
		const edited = ctx.request.body;
		const id = edited.id;

		console.log(ctx.request.body);

		Tasks[id].name = edited.name;
		Tasks[id].value = edited.value;

		console.log("pullTask - PUT");
		console.log(Tasks);

		ctx.response.body = "Ticket is edited";
		next();
	} else {
		next();
		return
	}
});
//full description

app.use((ctx, next) => {
	cors();
	ctx.response.set("Access-Control-Allow-Origin", "*");
	if (ctx.request.method === 'GET') {


		const id = ctx.request.header.info;
		const TicketInfo = {};
		TicketInfo.value = Tasks[id].value

		console.log(TicketInfo);

		ctx.response.body = TicketInfo;
		next();
	} else {
		next();
		return
	}
});


const server = http.createServer(app.callback());
server.listen(port, (error) => {
	if (error) {
		console.log(error);
		return;
	}
	console.log(`Server has started in port: ${port}`);
});