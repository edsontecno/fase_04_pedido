Feature: Testes BDD para pedidos

  Scenario: Criar um pedido
    Given que o usuario solicita a criacao de um pedido
    When o sistema cria o pedido
    Then retorna o numero do pedido 1

  Scenario: Consultar um pedido por ID
    Given que o usuario solicita uma consulta do pedido 1
    When o sistema busca os dados do pedido
    Then retorna os dados do pedido
    """
      {
        "id": 1,
        "customer": "12345678900",
        "items": [
          {
            "productId": 1,
            "amount": 2
          }
        ],
        "status": "recebido"
      }
    """

  Scenario: Listar pedidos por status
    Given que o usuario solicita uma consulta de pedidos com status "pronto"
    When o sistema busca os pedidos por status
    Then retorna os pedidos correspondentes

  Scenario: Listar pedidos de um cliente
    Given que o usuario solicita uma consulta de pedidos do cliente "12345678900"
    When o sistema busca os pedidos do cliente
    Then retorna a lista de pedidos do cliente

  Scenario: Alterar o status de um pedido
    Given que o usuario solicita a alteracao do status do pedido 1 para "finalizado"
    When o sistema atualiza o status do pedido
    Then retorna o pedido com status atualizado

  Scenario: Atualizar status do pagamento
    Given que o usuario solicita a atualizacao do status do pagamento do pedido 1 para "pago"
    When o sistema atualiza o status do pagamento
    Then retorna o status do pagamento atualizado
