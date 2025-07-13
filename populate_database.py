import json
import random
import urllib.request
import urllib.parse
import time

# Configuração
BASE_URL = "http://localhost:3001"

def generate_unique_id():
    """Gera um ID único baseado em timestamp e número aleatório"""
    return str(int(time.time() * 1000))[-8:] + str(random.randint(10, 99))

def make_request(method, url, data=None):
    """Faz uma requisição HTTP"""
    try:
        if data:
            data_encoded = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data_encoded, method=method)
            req.add_header('Content-Type', 'application/json')
        else:
            req = urllib.request.Request(url, method=method)
        
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        error_response = e.read().decode()
        print(f"Erro HTTP {e.code}: {error_response}")
        return None
    except Exception as e:
        print(f"Erro na requisição {method} {url}: {e}")
        return None

def create_supermarket(name, address, email, password):
    """Cria um supermercado através do registro de gerente"""
    url = f"{BASE_URL}/auth/register/manager"
    data = {
        "name": name,
        "email": email,
        "password": password,
        "address": address
    }
    response = make_request("POST", url, data)
    if response:
        print(f"✅ Supermercado criado: {name}")
        return response
    else:
        print(f"❌ Falha ao criar supermercado: {name}")
        return None

def create_user(name, email, password, user_type="cliente"):
    """Cria um usuário"""
    if user_type == "gerente":
        # Gerentes são criados junto com supermercados
        return None
    
    url = f"{BASE_URL}/auth/register/user"
    data = {
        "name": name,
        "email": email,
        "password": password
    }
    response = make_request("POST", url, data)
    if response:
        print(f"✅ Usuário criado: {name} ({user_type})")
        return response
    else:
        print(f"❌ Falha ao criar usuário: {email}")
        return None

def create_product(name, bar_code, variable_description=""):
    """Cria um produto"""
    url = f"{BASE_URL}/products"
    data = {
        "name": name,
        "barCode": bar_code,
        "variableDescription": variable_description
    }
    response = make_request("POST", url, data)
    if response:
        print(f"✅ Produto criado: {name}")
        return response
    else:
        print(f"❌ Falha ao criar produto: {name}")
        return None

def create_price_record(product_id, supermarket_id, price, user_id=1):
    """Cria um registro de preço"""
    url = f"{BASE_URL}/price-records"
    data = {
        "productId": product_id,
        "supermarketId": supermarket_id,
        "price": price,
        "userId": user_id,
        "available": True,
        "verified": True
    }
    response = make_request("POST", url, data)
    if response:
        return response
    else:
        print(f"❌ Falha ao criar registro de preço para produto {product_id} no supermercado {supermarket_id}")
        return None

def populate_database():
    print("🚀 Iniciando população do banco de dados...")
    
    # Lista para armazenar IDs criados
    supermarket_ids = []
    user_ids = []
    product_ids = []
    
    # 1. Criar 15 supermercados
    print("\n📍 Criando 15 supermercados...")
    unique_id = generate_unique_id()
    
    supermarkets_data = [
        ("Supermercado Central", "Centro", f"gerente1.{unique_id}@central.com", "senha123"),
        ("Mercado Bom Preço", "Bairro das Flores", f"gerente2.{unique_id}@bompreco.com", "senha123"),
        ("Extra Hipermercado", "Vila Nova", f"gerente3.{unique_id}@extra.com", "senha123"),
        ("Atacadão Dia a Dia", "Setor Norte", f"gerente4.{unique_id}@atacadao.com", "senha123"),
        ("SuperMax", "Zona Sul", f"gerente5.{unique_id}@supermax.com", "senha123"),
        ("Mercado da Vila", "Distrito Industrial", f"gerente6.{unique_id}@vila.com", "senha123"),
        ("Big Mart", "Centro Comercial", f"gerente7.{unique_id}@bigmart.com", "senha123"),
        ("Comercial Santos", "Avenida Principal", f"gerente8.{unique_id}@santos.com", "senha123"),
        ("Super Economia", "Bairro Alto", f"gerente9.{unique_id}@economia.com", "senha123"),
        ("Mercado Real", "Vila Esperança", f"gerente10.{unique_id}@real.com", "senha123"),
        ("Atacado Popular", "Setor Oeste", f"gerente11.{unique_id}@popular.com", "senha123"),
        ("Super Compras", "Jardim América", f"gerente12.{unique_id}@compras.com", "senha123"),
        ("Mercado Norte", "Centro da Cidade", f"gerente13.{unique_id}@norte.com", "senha123"),
        ("Hipermercado Sul", "Bairro do Sol", f"gerente14.{unique_id}@sul.com", "senha123"),
        ("Super Center", "Vila do Comércio", f"gerente15.{unique_id}@center.com", "senha123")
    ]
    
    for name, address, email, password in supermarkets_data:
        supermarket = create_supermarket(name, address, email, password)
        if supermarket and 'supermarketId' in supermarket:
            supermarket_ids.append(supermarket['supermarketId'])
    
    print(f"📊 Total de supermercados criados: {len(supermarket_ids)}")
    
    # 2. Criar 15 usuários
    print("\n👥 Criando 15 usuários...")
    users_data = [
        ("João Silva", f"joao.silva.{unique_id}@email.com", "123456", "cliente"),
        ("Maria Santos", f"maria.santos.{unique_id}@email.com", "123456", "cliente"),
        ("Pedro Oliveira", f"pedro.oliveira.{unique_id}@email.com", "123456", "cliente"),
        ("Ana Costa", f"ana.costa.{unique_id}@email.com", "123456", "cliente"),
        ("Carlos Pereira", f"carlos.pereira.{unique_id}@email.com", "123456", "cliente"),
        ("Lucia Alves", f"lucia.alves.{unique_id}@email.com", "123456", "cliente"),
        ("Roberto Lima", f"roberto.lima.{unique_id}@email.com", "123456", "cliente"),
        ("Fernanda Rocha", f"fernanda.rocha.{unique_id}@email.com", "123456", "cliente"),
        ("Marcos Souza", f"marcos.souza.{unique_id}@email.com", "123456", "cliente"),
        ("Patricia Dias", f"patricia.dias.{unique_id}@email.com", "123456", "cliente"),
        ("Ricardo Martins", f"ricardo.martins.{unique_id}@email.com", "123456", "cliente"),
        ("Juliana Ferreira", f"juliana.ferreira.{unique_id}@email.com", "123456", "cliente"),
        ("Antonio Barbosa", f"antonio.barbosa.{unique_id}@email.com", "123456", "gerente"),
        ("Carla Mendes", f"carla.mendes.{unique_id}@email.com", "123456", "gerente"),
        ("Eduardo Gomes", f"eduardo.gomes.{unique_id}@email.com", "123456", "gerente")
    ]
    
    for name, email, password, user_type in users_data:
        user = create_user(name, email, password, user_type)
        if user and 'userId' in user:
            user_ids.append(user['userId'])
    
    print(f"📊 Total de usuários criados: {len(user_ids)}")
    
    # 3. Criar 30 produtos
    print("\n🛒 Criando 30 produtos...")
    
    products_data = [
        ("Arroz Branco 5kg", f"{unique_id}00001", "Arroz branco tipo 1, 5kg"),
        ("Feijão Carioca 1kg", f"{unique_id}00002", "Feijão carioca selecionado"),
        ("Açúcar Cristal 1kg", f"{unique_id}00003", "Açúcar cristal refinado"),
        ("Óleo de Soja 900ml", f"{unique_id}00004", "Óleo de soja refinado"),
        ("Farinha de Trigo 1kg", f"{unique_id}00005", "Farinha de trigo especial"),
        ("Macarrão Espaguete 500g", f"{unique_id}00006", "Macarrão espaguete"),
        ("Sal Refinado 1kg", f"{unique_id}00007", "Sal refinado iodado"),
        ("Café em Pó 500g", f"{unique_id}00008", "Café torrado e moído"),
        ("Leite Integral 1L", f"{unique_id}00009", "Leite integral UHT"),
        ("Ovos Brancos Dúzia", f"{unique_id}00010", "Ovos de galinha brancos"),
        ("Sabonete Dove 90g", f"{unique_id}00011", "Sabonete hidratante"),
        ("Shampoo 325ml", f"{unique_id}00012", "Shampoo para cabelos normais"),
        ("Pasta de Dente 90g", f"{unique_id}00013", "Creme dental com flúor"),
        ("Desodorante 150ml", f"{unique_id}00014", "Desodorante antitranspirante"),
        ("Papel Higiênico 4 rolos", f"{unique_id}00015", "Papel higiênico folha dupla"),
        ("Detergente 500ml", f"{unique_id}00016", "Detergente neutro"),
        ("Água Sanitária 1L", f"{unique_id}00017", "Água sanitária"),
        ("Sabão em Pó 1kg", f"{unique_id}00018", "Sabão em pó concentrado"),
        ("Amaciante 2L", f"{unique_id}00019", "Amaciante de roupas"),
        ("Esponja de Aço", f"{unique_id}00020", "Esponja de aço multiuso"),
        ("Refrigerante Cola 2L", f"{unique_id}00021", "Refrigerante cola"),
        ("Suco de Laranja 1L", f"{unique_id}00022", "Suco natural de laranja"),
        ("Água Mineral 1,5L", f"{unique_id}00023", "Água mineral natural"),
        ("Cerveja 350ml", f"{unique_id}00024", "Cerveja pilsen"),
        ("Energético 250ml", f"{unique_id}00025", "Bebida energética"),
        ("Biscoito Recheado 90g", f"{unique_id}00026", "Biscoito recheado"),
        ("Chocolate 126g", f"{unique_id}00027", "Chocolate com biscoito"),
        ("Batata Chips 140g", f"{unique_id}00028", "Batata frita ondulada"),
        ("Pipoca de Micro 100g", f"{unique_id}00029", "Pipoca para microondas"),
        ("Barra de Cereal 66g", f"{unique_id}00030", "Barra de cereal integral")
    ]
    
    for name, bar_code, description in products_data:
        product = create_product(name, bar_code, description)
        if product and 'id' in product:
            product_ids.append(product['id'])
    
    print(f"📊 Total de produtos criados: {len(product_ids)}")
    
    print("\n💰 Criando registros de preços...")
    total_price_records = 0
    
    for i, product_id in enumerate(product_ids):
        print(f"Criando preços para produto {i+1}/{len(product_ids)}...")
        for supermarket_id in supermarket_ids:
            # Criar múltiplos registros de preço para cada produto/supermercado
            num_records = random.randint(2, 6)  # Entre 2 e 6 registros por produto/supermercado
            
            for j in range(num_records):
                price = round(random.uniform(0.50, 50.00), 2)
                user_id = random.choice(user_ids)
                
                price_record = create_price_record(product_id, supermarket_id, price, user_id)
                if price_record:
                    total_price_records += 1
                
                # Pequeno delay para garantir diferentes timestamps
                time.sleep(0.01)
    
    print(f"📊 Total de registros de preços criados: {total_price_records}")
    
    # Resumo final
    print("\n🎉 População do banco de dados concluída!")
    print(f"📊 Resumo:")
    print(f"   - Supermercados: {len(supermarket_ids)}")
    print(f"   - Usuários: {len(user_ids)}")
    print(f"   - Produtos: {len(product_ids)}")
    print(f"   - Registros de preços: {total_price_records}")
    print(f"   - Média de registros por produto/supermercado: {total_price_records / (len(product_ids) * len(supermarket_ids)):.1f}")

if __name__ == "__main__":
    try:
        populate_database()
    except Exception as e:
        print(f"❌ Erro durante a execução: {e}")
        import traceback
        traceback.print_exc()
