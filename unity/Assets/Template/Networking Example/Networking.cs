using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using UnityEngine;
using UnityEngine.UI;



public class Networking : MonoBehaviour
{
    [SerializeField]
    Text txt;

    int times = 0;

    const string host =
#if UNITY_EDITOR
    "http://localhost:3001";
#else
    "https://twowolf-ld53.herokuapp.com";
#endif

    HttpClient client = new HttpClient();
    async void Start()
    {
        
        var response = await client.GetAsync(host + "/game/helloworld");
        string result = await response.Content.ReadAsStringAsync();
        Debug.Log(result);

        PullButton();
    }

    async void PullButton() {
        var response = await client.GetAsync(host + "/game/button");
        Debug.Log(response);
        string result = await response.Content.ReadAsStringAsync();
        Debug.Log(result);
        times = int.Parse(result);
        txt.text = times.ToString();

        Debug.Log(result);
    }

    public async void PushButton() {
        txt.text = (++times).ToString();
        var data = new StringContent($"{times}", Encoding.UTF8, "text/plain");
        var response = await client.PostAsync(host + "/game/button", data);
        string result = await response.Content.ReadAsStringAsync();

        Debug.Log(result);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
