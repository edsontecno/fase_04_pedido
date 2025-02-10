import { Given, When, Then } from "@cucumber/cucumber";
import { strict as assert } from "assert";
import { CreateOrderDto } from "src/adapters/order/dto/create-order.dto";

class MockOrderController {
  async save(dto: CreateOrderDto): Promise<number> {
    return 1;
  }

  async getById(id: number): Promise<object> {
    return {
      id: 1,
      customer: "12345678900",
      items: [{ productId: 1, amount: 2 }],
      status: "recebido",
    };
  }

  async changeStatus(id: number, status: string): Promise<object> {
    return { id, status };
  }

  async getByStatus(status: string): Promise<object[]> {
    return [
      { id: 1, customer: "12345678900", items: [{ productId: 1, amount: 2 }], status },
    ];
  }

  async getByCustomer(customerId: string): Promise<object[]> {
    return [
      { id: 1, customer: customerId, items: [{ productId: 1, amount: 2 }], status: "recebido" },
    ];
  }

  async updatePaymentStatus(id: number, status: string): Promise<object> {
    return { id, status }; 
  }
}

let controller: MockOrderController;
let response: any;

Given("que o usuario solicita a criacao de um pedido", async () => {
  controller = new MockOrderController();
  const orderDto: CreateOrderDto = {
    customer: "12345678900",
    items: [{ productId: 1, amount: 2 }],
  };
  response = await controller.save(orderDto);
});

When("o sistema cria o pedido", () => {
  if (!response) {
    throw new Error("O pedido não foi criado corretamente");
  }
});

Then("retorna o numero do pedido {int}", (expectedNumber: number) => {
  assert.equal(response, expectedNumber);
});

Given("que o usuario solicita uma consulta do pedido {int}", async (id: number) => {
  controller = new MockOrderController();
  response = await controller.getById(id);
});

When("o sistema busca os dados do pedido", () => {
  if (!response) {
    throw new Error("O pedido não foi encontrado");
  }
});

Then("retorna os dados do pedido", function (docString: string) {
  const expectedObject = JSON.parse(docString);
  assert.deepStrictEqual(response, expectedObject);
});


Given("que o usuario solicita a alteracao do status do pedido {int} para {string}", async (id: number, status: string) => {
  controller = new MockOrderController();
  response = await controller.changeStatus(id, status);
});

When("o sistema atualiza o status do pedido", () => {
  if (!response) {
    throw new Error("O status do pedido não foi atualizado corretamente");
  }
});

Then("retorna o pedido com status atualizado", function () {
  assert.ok(response.status);
});

Given("que o usuario solicita uma consulta de pedidos com status {string}", async function (status: string) {
  controller = new MockOrderController();
  response = await controller.getByStatus(status);
});

When("o sistema busca os pedidos por status", async function () {
});

Then("retorna os pedidos correspondentes", function () {
  assert.ok(response);
  assert.deepStrictEqual(response[0].status, 'pronto'); 
});

Given("que o usuario solicita uma consulta de pedidos do cliente {string}", async function (customerId: string) {
  controller = new MockOrderController();
  response = await controller.getByCustomer(customerId);
});

When("o sistema busca os pedidos do cliente", async function () {
});

Then("retorna a lista de pedidos do cliente", function () {
  assert.ok(response);
  assert.deepStrictEqual(response[0].customer, '12345678900');
});

Given("que o usuario solicita a atualizacao do status do pagamento do pedido {int} para {string}", async function (id: number, status: string) {
  controller = new MockOrderController();
  response = await controller.updatePaymentStatus(id, status);
});

When("o sistema atualiza o status do pagamento", async function () {
});

Then("retorna o status do pagamento atualizado", function () {
  assert.ok(response);
  assert.deepStrictEqual(response.status, 'pago');
});
