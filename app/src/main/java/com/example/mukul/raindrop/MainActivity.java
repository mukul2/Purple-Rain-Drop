package com.example.mukul.raindrop;

import android.content.res.Resources;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.FrameLayout;

import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity {
    Drop[] drop=new Drop[(Resources.getSystem().getDisplayMetrics().widthPixels)/2];
    Timer timer=null;
    TimerTask timerTask=null;
    Handler handler=new Handler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        FrameLayout mainView=(FrameLayout)findViewById(R.id.mainView);



        for(int i=0;i<drop.length;i++)
        {
            drop[i]=new Drop(this);
            mainView.addView(drop[i]);
        }




    }

    @Override
    protected void onResume() {
        timer=new Timer();
        timerTask=new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {

                        for(int i=0;i<drop.length;i++) {


                            drop[i].invalidate();
                            drop[i].fall();
                        }

                    }
                });
            }
        };

        timer.schedule(timerTask,3,1);



        super.onResume();
    }
}
