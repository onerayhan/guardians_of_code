package com.example.kotlin_profile_page


import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.ArrayAdapter
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import com.example.kotlin_profile_page.databinding.FollowerListBinding


class FollowerListFragment : DialogFragment() {

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val binding = FollowerListBinding.inflate(LayoutInflater.from(requireContext()))

        val followerData = arrayOf("Ozgur Zengi", "Alex Dreyfus", "Marlon Brown", "Kemal Ince", "Recep Aksener", "Ozgur Zengi", "Alex Dreyfus", "Marlon Brown", "Kemal Ince", "Recep Aksener")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, followerData)

        binding.followerListView.adapter = adapter

        val builder = AlertDialog.Builder(requireContext())
        builder.setView(binding.root)
            .setTitle("Followers List")
            .setPositiveButton("Close") { _, _ ->
                dismiss()
            }

        return builder.create()
    }

    companion object {
        fun show(fragmentManager: FragmentManager) {
            val fragment = FollowerListFragment()
            fragment.show(fragmentManager, "followerListFragment")
        }
    }
}