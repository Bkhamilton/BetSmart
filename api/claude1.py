import requests

def get_contests(sport=None):
    url = "https://www.draftkings.com/lobby/getcontests"
    if sport:
        url += f"?sport={sport}"
    response = requests.get(url)
    return response.json()

def get_detailed_contest_info(contest_id):
    url = f"https://api.draftkings.com/contests/v1/contests/{contest_id}?format=json"
    response = requests.get(url)
    return response.json()

def get_draft_groups(draft_group_id):
    url = f"https://api.draftkings.com/draftgroups/v1/{draft_group_id}"
    response = requests.get(url)
    return response.json()

def get_rulesets(game_type_id):
    url = f"https://api.draftkings.com/lineups/v1/gametypes/{game_type_id}/rules"
    response = requests.get(url)
    return response.json()

def get_draftable_players(draft_group_id):
    url = f"https://api.draftkings.com/draftgroups/v1/draftgroups/{draft_group_id}/draftables"
    response = requests.get(url)
    return response.json()

def get_available_players(draft_group_id):
    url = f"https://www.draftkings.com/lineup/getavailableplayers?draftGroupId={draft_group_id}"
    response = requests.get(url)
    return response.json()

def get_countries():
    url = "https://api.draftkings.com/addresses/v1/countries"
    response = requests.get(url)
    return response.json()

def get_regions(country_code):
    url = f"https://api.draftkings.com/addresses/v1/countries/{country_code}/regions"
    response = requests.get(url)
    return response.json()

def get_rules_and_scoring():
    url = "https://api.draftkings.com/rules-and-scoring/RulesAndScoring.json"
    response = requests.get(url)
    return response.json()

def get_sports():
    url = "https://api.draftkings.com/sites/US-DK/sports/v1/sports"
    response = requests.get(url)
    return response.json()