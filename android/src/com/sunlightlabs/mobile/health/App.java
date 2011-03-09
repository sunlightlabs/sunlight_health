package com.sunlightlabs.mobile.health;

import android.os.Bundle;
import com.phonegap.*;

public class App extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}