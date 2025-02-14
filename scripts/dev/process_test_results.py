import json

# Path to the JSON file
file_path = 'test_results.json'

# Read the JSON file
with open(file_path, 'r') as file:
    test_results = json.load(file)

    parsed_results = []
    # for each entry in the property testResults
    for test_result in test_results['testResults']:
        # calculate the test time
        test_time = test_result['endTime'] - test_result['startTime']
        # strip the path down to src/.../test_name
        path = test_result['name'].split('src/')
        path = path[-1]
        parsed_results.append({
            'path': path,
            'testTime': test_time
        })

    # Sort the results by test time descending
    parsed_results.sort(key=lambda x: x['testTime'], reverse=True)

    # Print the top ten slowest tests
    for i in range(min(len(parsed_results),10)):
        print(parsed_results[i])

