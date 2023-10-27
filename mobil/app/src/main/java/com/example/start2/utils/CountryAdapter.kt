package com.example.start2

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import com.example.start2.models.Country
import com.example.start2.R

class CountryAdapter(
    context: Context,
    private val countries: List<Country>
) : ArrayAdapter<Country>(context, R.layout.spinner_item, countries) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        return createItemView(position, convertView, parent)
    }

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        return createItemView(position, convertView, parent)
    }

    private fun createItemView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = LayoutInflater.from(context).inflate(R.layout.spinner_item, parent, false)

        val countryFlag = view.findViewById<TextView>(R.id.countryFlag) // Ensure this is a TextView in your layout
        val countryNameAndCode = view.findViewById<TextView>(R.id.countryNameAndCode)

        // Set the emoji as the text for the TextView
        countryFlag.text = countries[position].flag

        // Set the country name and dial code for the other TextView
        countryNameAndCode.text = "${countries[position].name} (${countries[position].dial_code})"

        return view
    }
}
