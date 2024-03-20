# To build the python backened and allow for HTTP API calls, we will use the Flask web framework
from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)

CORS(app)

with open('stock.json') as f:
    current_soda_stock = json.load(f)


## ADMIN FUNCTIONS
# Price Change
# Api Def to change price of soda
@app.route('/api/admin/price_change', methods=['POST'])
def adm_price_change():
    
    # Function takes in the stock.json
    # and modifies the spcified soda and its price
    
    with open('stock.json') as f:
        current_soda_stock = json.load(f)    

    # Process the request into a json
    incoming = request.json
    sodaName = incoming["sodaName"]
    newPrice = incoming['newPrice']
    
    current_soda_stock[sodaName]['price'] = newPrice
    
    with open('stock.json', 'w') as f:
        json.dump(current_soda_stock, f)
    
    return jsonify(current_soda_stock)


# API Definition to restock machine
@app.route('/api/admin/restock', methods=['POST'])
def adm_restock():
    
    # This Function is called from the Admin HTTP API
    # Function takes from the API:
    # The Soda name and amount of stock to add to the machine
    # Its important here to check the stock of the machine already
    # to ensure that there is enough room for the desired restock quanitity.
    
    with open('stock.json') as f:
        current_soda_stock = json.load(f)
    
    incoming = request.json
    sodaName = incoming["sodaName"]
    restockQuantity = incoming["restockQuantity"]
    maxRestock = current_soda_stock[sodaName]["maxQuantity"]
    available = current_soda_stock[sodaName]["available"]
    
    if available + restockQuantity <= maxRestock:
        current_soda_stock[sodaName]["available"] += restockQuantity
        current_soda_stock['AdminInfo']['times_restock'] += 1
    
    with open('stock.json', 'w') as f:
        json.dump(current_soda_stock, f)
    
    return jsonify(current_soda_stock)

## Customer Functions

@app.route('/api/display_stock', methods=['GET'])
def cst_display_stock():
    # Simple GET call to take the stock.json file and send it as a 
    # JSON structure to the HTML page for variable display
    with open('stock.json') as f:
        current_soda_stock = json.load(f)    
    return json.dumps(current_soda_stock)

@app.route('/api/customer_purchase', methods=['POST', 'GET'])
def cst_purchase():
    
    # When function is called, we take in the current stock file,
    # and then modify the variables as needed
    # and finally rewrite the stock file and send the json structure as API response body
    
    with open('stock.json') as f:
        current_soda_stock = json.load(f)
    
    incoming = request.json
    sodaName = incoming["sodaName"]
    if current_soda_stock[sodaName]["available"] != 0:
        current_soda_stock[sodaName]["available"] -= 1
        current_soda_stock['AdminInfo']['balance'] += current_soda_stock[sodaName]['price']
        current_soda_stock['AdminInfo']['purchases'] += 1
    with open('stock.json', 'w') as f:
        json.dump(current_soda_stock, f)
    
    return jsonify(current_soda_stock)
    
MACHINE_CASH = 100

if __name__ == '__main__':
    with app.app_context():
        app.run(debug=True)
        

