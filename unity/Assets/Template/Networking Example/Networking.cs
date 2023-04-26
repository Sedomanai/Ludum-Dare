using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System.Net;
using System.Net.Http;

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

    void Start() {
        StartCoroutine(PullFromNet());
    }

    IEnumerator PullFromNet() {
        UnityWebRequest req = UnityWebRequest.Get(host + "/game/helloworld");
        req.SetRequestHeader("Content-Type", "text/plain");
        yield return req.SendWebRequest();
        if (req.result == UnityWebRequest.Result.Success) {
            Debug.Log(req.downloadHandler.text);
        } req.Dispose();

        req = UnityWebRequest.Get(host + "/game/button");
        req.SetRequestHeader("Content-Type", "text/plain");
        yield return req.SendWebRequest();
        if (req.result == UnityWebRequest.Result.Success) {
            times = int.Parse(req.downloadHandler.text);
            txt.text = times.ToString();
            Debug.Log($"Pulled Button From Net {times}");
        } req.Dispose();
    }

    Queue<Action> requestQueue = new Queue<Action>();
    bool isCoroutineRunning = false;
    public void PushButton() {
        txt.text = (++times).ToString();
        requestQueue.Enqueue(() => StartCoroutine(PushFromNet(txt.text)));
        if (!isCoroutineRunning) {
            ProcessNextRequest();
        }
    }
    void ProcessNextRequest() {
        if (requestQueue.Count > 0) {
            Action nextRequest = requestQueue.Dequeue();
            nextRequest();
        }
    }

    IEnumerator PushFromNet(string value) {
        isCoroutineRunning = true;
        using (UnityWebRequest req = UnityWebRequest.Post(host + "/game/button", value)) {
            req.SetRequestHeader("Content-Type", "text/plain");
            yield return req.SendWebRequest();
            if (req.result == UnityWebRequest.Result.Success) {
                Debug.Log($"Pushed Button to Net {value}: {req.downloadHandler.text}");
            }
        }
        isCoroutineRunning = false;
        ProcessNextRequest();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
